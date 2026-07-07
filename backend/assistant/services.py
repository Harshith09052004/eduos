import os

from django.conf import settings
from django.core.cache import cache
from openai import OpenAI

from students.models import Student
from faculty.models import Faculty
from colleges.models import Department
from attendance.models import Attendance
from placements.models import Placement


CACHE_TTL = 60


class ContextBuilder:
    """Fetches relevant EduOS data based on the user prompt."""

    def build(self, prompt: str) -> str:
        context_parts = []
        prompt_lower = prompt.lower()

        if any(w in prompt_lower for w in ["risk", "at-risk", "failing", "danger", "predict"]):
            context_parts.append(self._get_at_risk_context())

        if any(w in prompt_lower for w in ["student", "attendance", "below 75", "low attendance"]):
            context_parts.append(self._get_attendance_context())

        if any(w in prompt_lower for w in ["placement", "placed", "company", "package", "job"]):
            context_parts.append(self._get_placement_context())

        if any(w in prompt_lower for w in ["faculty", "teacher", "professor", "hod"]):
            context_parts.append(self._get_faculty_context())

        if any(w in prompt_lower for w in ["department", "dept", "branch", "compare"]):
            context_parts.append(self._get_department_context())

        if any(w in prompt_lower for w in ["student", "roll", "name", "detail", "info"]):
            context_parts.append(self._get_student_context())

        if any(w in prompt_lower for w in ["summary", "overview", "stat", "count", "total", "how many", "health", "analysis"]):
            context_parts.append(self._get_summary_context())
            context_parts.append(self._get_attendance_context())
            context_parts.append(self._get_placement_context())

        if not context_parts:
            context_parts.append(self._get_summary_context())

        return "\n\n".join(context_parts)

    def _get_at_risk_context(self) -> str:
        students = Student.objects.select_related("attendance_record").only(
            "first_name", "last_name", "roll_no", "department", "year", "cgpa",
            "attendance_record__attendance_percentage",
        )
        lines = ["### AT-RISK STUDENT ANALYSIS ###"]
        at_risk = []
        for s in students:
            att = getattr(s, "attendance_record", None)
            if att is None:
                continue
            if float(att.attendance_percentage) < 75 or s.cgpa < 7.0:
                at_risk.append(s)
                lines.append(
                    f"- {s.first_name} {s.last_name} ({s.roll_no}, {s.department}, Year {s.year}) - "
                    f"Attendance: {att.attendance_percentage}%, CGPA: {s.cgpa}"
                )

        placed_ids = set(Placement.objects.values_list("student_id", flat=True))
        unplaced_seniors = Student.objects.filter(year__gte=3).exclude(id__in=placed_ids).count()
        lines.append(f"\nTotal at-risk students: {len(at_risk)}")
        lines.append(f"Unplaced senior students (Year 3+): {unplaced_seniors}")
        return "\n".join(lines)

    def _get_attendance_context(self) -> str:
        below_75 = Attendance.objects.filter(attendance_percentage__lt=75).select_related("student")
        total = cache.get_or_set("attendance_count", Attendance.objects.count, CACHE_TTL)
        lines = [f"Total attendance records: {total}"]
        if below_75.exists():
            lines.append(f"Students below 75% attendance: {below_75.count()}")
            for a in below_75[:20]:
                s = a.student
                lines.append(
                    f"- {s.first_name} {s.last_name} ({s.roll_no}, {s.department}) - "
                    f"{a.attendance_percentage}% attended ({a.classes_attended}/{a.total_classes} classes)"
                )
        return "\n".join(lines)

    def _get_placement_context(self) -> str:
        placements = Placement.objects.select_related("student").all()
        total = cache.get_or_set("placement_count", placements.count, CACHE_TTL)
        lines = [f"Total placements: {total}"]
        for p in placements[:20]:
            s = p.student
            lines.append(
                f"- {s.first_name} {s.last_name} ({s.roll_no}, {s.department}) → "
                f"{p.company} as {p.role} | ₹{p.package} LPA"
            )
        return "\n".join(lines)

    def _get_faculty_context(self) -> str:
        faculty = Faculty.objects.all()
        total = cache.get_or_set("faculty_count", faculty.count, CACHE_TTL)
        lines = [f"Total faculty: {total}"]
        for f in faculty[:20]:
            lines.append(f"- {f.first_name} {f.last_name} ({f.employee_id}) - {f.department}, {f.designation}")
        return "\n".join(lines)

    def _get_department_context(self) -> str:
        depts = Department.objects.all()
        lines = [f"Total departments: {depts.count()}"]
        for d in depts:
            lines.append(f"- {d.name} ({d.code}) - HOD: {d.hod}, Students: {d.total_students}, Faculty: {d.total_faculty}")
        return "\n".join(lines)

    def _get_student_context(self) -> str:
        students = Student.objects.all()
        total = cache.get_or_set("student_count", students.count, CACHE_TTL)
        lines = [f"Total students: {total}"]
        for s in students[:20]:
            lines.append(f"- {s.first_name} {s.last_name} ({s.roll_no}) - {s.department}, Year {s.year}, CGPA: {s.cgpa}")
        return "\n".join(lines)

    def _get_summary_context(self) -> str:
        return (
            f"Student count: {cache.get_or_set('student_count', Student.objects.count, CACHE_TTL)}\n"
            f"Faculty count: {cache.get_or_set('faculty_count', Faculty.objects.count, CACHE_TTL)}\n"
            f"Department count: {cache.get_or_set('dept_count', Department.objects.count, CACHE_TTL)}\n"
            f"Attendance records: {cache.get_or_set('attendance_count', Attendance.objects.count, CACHE_TTL)}\n"
            f"Placement records: {cache.get_or_set('placement_count', Placement.objects.count, CACHE_TTL)}"
        )


class AIService:
    """Sends prompts to OpenAI or Ollama and returns the response."""

    def __init__(self):
        self.provider = getattr(settings, "AI_PROVIDER", "openai").lower()
        self.model = getattr(settings, "AI_MODEL", "gpt-4o-mini")
        self.openai_client = None

        base_url = None
        api_key = os.getenv("OPENAI_API_KEY", "no-key")

        if self.provider == "openai":
            base_url = os.getenv("OPENAI_BASE_URL")
        elif self.provider == "ollama":
            base_url = getattr(settings, "OLLAMA_BASE_URL", "http://localhost:11434/v1")
            api_key = "ollama"
            if self.model == "llama3":
                self.model = "llama3.2:1b"

        kwargs = {"api_key": api_key}
        if base_url:
            kwargs["base_url"] = base_url
        self.openai_client = OpenAI(**kwargs)

    def stream_chat(self, prompt: str, context: str, history: list[dict] | None = None):
        system_prompt = (
            "You are EduOS AI, a concise assistant for an Education Management System. "
            "Answer ONLY from the data below. Use short bullet points. "
            "For predictions: identify at-risk students (<75% attendance or <7.0 CGPA), "
            "predict placement readiness, and recommend improvements.\n\n"
            f"### DATA ###\n{context}\n### END ###"
        )

        messages = [{"role": "system", "content": system_prompt}]
        if history:
            messages.extend(history[-6:])
        messages.append({"role": "user", "content": prompt})

        if self.openai_client is None:
            yield "AI service is not configured. Set OPENAI_API_KEY or configure Ollama."
            return

        try:
            stream = self.openai_client.chat.completions.create(
                model=self.model,
                messages=messages,
                stream=True,
                temperature=0.7,
                max_tokens=1024,
            )
            for chunk in stream:
                delta = chunk.choices[0].delta if chunk.choices else None
                if delta and delta.content:
                    yield delta.content
        except Exception as e:
            yield f"\n\nError: {str(e)}"
