from datetime import date, timedelta
from random import choice, randint, uniform

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from students.models import Student
from faculty.models import Faculty
from colleges.models import Department
from attendance.models import Attendance
from placements.models import Placement

User = get_user_model()

departments_data = [
    {"name": "Computer Science", "code": "CS", "hod": "Dr. Sharma", "total_students": 120, "total_faculty": 15},
    {"name": "Information Technology", "code": "IT", "hod": "Dr. Gupta", "total_students": 100, "total_faculty": 12},
    {"name": "Electronics & Communication", "code": "EC", "hod": "Dr. Verma", "total_students": 110, "total_faculty": 14},
    {"name": "Mechanical Engineering", "code": "ME", "hod": "Dr. Singh", "total_students": 90, "total_faculty": 11},
    {"name": "Civil Engineering", "code": "CE", "hod": "Dr. Patel", "total_students": 80, "total_faculty": 10},
]

first_names = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
               "Ananya", "Priya", "Neha", "Riya", "Shreya", "Pooja", "Kavya", "Aditi", "Sneha", "Divya",
               "Rahul", "Rohit", "Amit", "Vikram", "Suresh", "Deepak", "Manish", "Rajesh", "Sanjay", "Anil",
               "Sita", "Geeta", "Radha", "Lakshmi", "Parvati", "Meera", "Sunita", "Anita", "Usha", "Rekha"]

last_names = ["Sharma", "Verma", "Gupta", "Kumar", "Singh", "Patel", "Reddy", "Rao", "Joshi", "Das",
              "Mishra", "Agarwal", "Pandey", "Yadav", "Saxena", "Dubey", "Nair", "Menon", "Iyer", "Deshmukh"]

companies = ["Google", "Microsoft", "Amazon", "Tesla", "Infosys", "TCS", "Wipro", "Flipkart", "Uber", "Adobe"]
roles = ["SDE-1", "Data Analyst", "ML Engineer", "Full Stack Developer", "DevOps Engineer", "Backend Developer",
         "Frontend Developer", "Cloud Engineer", "Security Analyst", "Product Manager"]


class Command(BaseCommand):
    help = "Seed the database with dummy data for testing"

    def handle(self, *args, **options):
        self.stdout.write("Seeding data...")

        dept_objs = {}
        for d in departments_data:
            obj, _ = Department.objects.get_or_create(
                code=d["code"],
                defaults=d,
            )
            dept_objs[d["code"]] = obj
            self.stdout.write(f"  Department: {d['name']}")

        admin, _ = User.objects.get_or_create(
            email="admin@eduos.com",
            defaults={"is_superuser": True, "is_staff": True},
        )
        admin.set_password("admin123")
        admin.save()
        self.stdout.write("  Admin user: admin@eduos.com / admin123")

        student_ids = []
        for i in range(40):
            first = choice(first_names)
            last = choice(last_names)
            dept_code = choice(list(dept_objs.keys()))
            roll = f"2024{dept_code}{i+1:03d}"
            year = choice([1, 2, 3, 4])
            email = f"{first.lower()}.{last.lower()}{i+1}@eduos.com"

            student, created = Student.objects.get_or_create(
                roll_no=roll,
                defaults={
                    "first_name": first,
                    "last_name": last,
                    "email": email,
                    "phone": f"98765{i+1:05d}",
                    "department": dept_code,
                    "year": year,
                    "section": choice(["A", "B", "C"]),
                    "attendance": round(uniform(60, 100), 2),
                    "cgpa": round(uniform(6.0, 9.5), 2),
                },
            )
            if created:
                student_ids.append(student.id)
                total = randint(30, 50)
                attended = int(total * student.attendance / 100)
                Attendance.objects.get_or_create(
                    student=student,
                    defaults={
                        "attendance_percentage": round(student.attendance, 2),
                        "total_classes": total,
                        "classes_attended": attended,
                    },
                )
        self.stdout.write(f"  Students: {len(student_ids)} created")

        for i in range(20):
            first = choice(first_names)
            last = choice(last_names)
            dept_code = choice(list(dept_objs.keys()))
            emp_id = f"FAC{i+1:03d}"
            email = f"{first.lower()}.{last.lower()}.faculty@eduos.com"
            Faculty.objects.get_or_create(
                employee_id=emp_id,
                defaults={
                    "first_name": first,
                    "last_name": last,
                    "email": email,
                    "phone": f"99887{i+1:05d}",
                    "department": dept_code,
                    "designation": choice(["Professor", "Associate Professor", "Assistant Professor", "Lecturer"]),
                    "experience": randint(1, 20),
                    "salary": round(uniform(30000, 120000), 2),
                },
            )
        self.stdout.write("  Faculty: 20 created")

        students_list = list(Student.objects.all())
        for i in range(15):
            student = choice(students_list)
            company = choice(companies)
            role = choice(roles)
            package = round(uniform(4.0, 25.0), 2)
            Placement.objects.get_or_create(
                student=student,
                company=company,
                defaults={
                    "role": role,
                    "package": package,
                    "placement_date": date.today() - timedelta(days=randint(1, 365)),
                },
            )
        self.stdout.write("  Placements: 15 created")

        self.stdout.write(self.style.SUCCESS("Done! Data seeded successfully."))
