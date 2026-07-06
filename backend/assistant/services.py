import json
import os

from openai import OpenAI

from students.models import Student
from faculty.models import Faculty
from colleges.models import Department
from attendance.models import Attendance
from placements.models import Placement


class ContextBuilder:
    """Fetches relevant EduOS data based on the user prompt."""

    def build(self, prompt: str) -> str:
        context_parts = []

        prompt_lower = prompt.lower()

        if any(w in prompt_lower for w in ["student", "attendance", "below 75", "low attendance"]):
            context_parts.append(self._get_attendance_context())

        if any(w in prompt_lower for w in ["placement", "placed", "company", "package", "job"]):
            context_parts.append(self._get_placement_context())

        if any(w in prompt_lower for w in ["faculty", "teacher", "professor", "hod"]):
            context_parts.append(self._get_faculty_context())

        if any(w in prompt_lower for w in ["department", "dept", "branch"]):
            context_parts.append(self._get_department_context())

        if any(w in prompt_lower for w in ["student", "roll", "name", "detail", "info"]):
            context_parts.append(self._get_student_context())

        if any(w in prompt_lower for w in ["summary", "overview", "stat", "count", "total", "how many"]):
            context_parts.append(self._get_summary_context())

        if not context_parts:
            context_parts.append(self._get_summary_context())

        return "\n\n".join(context_parts)

    def _get_attendance_context(self) -> str:
        below_75 = Attendance.objects.filter(attendance_percentage__lt=75).select_related("student")
        total = Attendance.objects.count()
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
        lines = [f"Total placements: {placements.count()}"]
        for p in placements[:20]:
            s = p.student
            lines.append(
                f"- {s.first_name} {s.last_name} ({s.roll_no}, {s.department}) → "
                f"{p.company} as {p.role} | ₹{p.package} LPA"
            )
        return "\n".join(lines)

    def _get_faculty_context(self) -> str:
        faculty = Faculty.objects.all()
        lines = [f"Total faculty: {faculty.count()}"]
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
        lines = [f"Total students: {students.count()}"]
        for s in students[:20]:
            lines.append(f"- {s.first_name} {s.last_name} ({s.roll_no}) - {s.department}, Year {s.year}, CGPA: {s.cgpa}")
        return "\n".join(lines)

    def _get_summary_context(self) -> str:
        return (
            f"Student count: {Student.objects.count()}\n"
            f"Faculty count: {Faculty.objects.count()}\n"
            f"Department count: {Department.objects.count()}\n"
            f"Attendance records: {Attendance.objects.count()}\n"
            f"Placement records: {Placement.objects.count()}"
        )


class AIService:
    """Sends prompts to OpenAI or Ollama and returns the response."""

    def __init__(self):
        self.provider = os.getenv("AI_PROVIDER", "openai").lower()
        self.model = os.getenv("AI_MODEL", "gpt-4o-mini")
        self.openai_client = None

        if self.provider == "openai":
            self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        elif self.provider == "ollama":
            base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
            self.openai_client = OpenAI(base_url=base_url, api_key="ollama")

    def stream_chat(self, prompt: str, context: str, history: list[dict] | None = None):
        """
        Generator that yields response tokens as they arrive.
        history: list of {"role": "user"/"assistant", "content": "..."}
        """
        system_prompt = (
            "You are EduOS AI, an intelligent assistant for an Education Management System. "
            "You have access to the following data from the EduOS database. "
            "Answer questions accurately based on this data. Be concise and helpful.\n\n"
            f"### DATABASE CONTEXT ###\n{context}\n### END CONTEXT ###"
        )

        messages = [{"role": "system", "content": system_prompt}]
        if history:
            messages.extend(history)
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
                max_tokens=2048,
            )
            for chunk in stream:
                delta = chunk.choices[0].delta if chunk.choices else None
                if delta and delta.content:
                    yield delta.content
        except Exception as e:
            yield f"\n\nError: {str(e)}"
