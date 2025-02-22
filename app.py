from flask import (Flask, flash, jsonify, redirect, render_template, request,
                   url_for)
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_url_path='/static')

server = 'localhost\\SQLEXPRESS'
database = 'master'
driver = 'ODBC Driver 17 for SQL Server'  # Ensure this driver is installed

SQLALCHEMY_DATABASE_URI  = f'mssql+pyodbc://@{server}/{database}?driver={driver}&trusted_connection=yes'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = "your_secret_key"

app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SECRET_KEY"] = SECRET_KEY

# >>>>>>>>>>>>>>>>>>>>>>>>>>>> Start: MODELS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)


class Marks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    sem = db.Column(db.Integer, nullable=False)
    marks = db.Column(db.Integer, nullable=False)


# >>>>>>>>>>>>>>>>>>>>>>>>>>>> End: MODELS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# Create tables
with app.app_context():
    db.create_all()
    if not Marks.query.first():
        dummy_data = [
            Marks(name="John Doe", subject="Mathematics", year=2023, sem=1, marks=85),
            Marks(name="Alice Smith", subject="Physics", year=2023, sem=1, marks=90),
            Marks(name="Bob Johnson", subject="Chemistry", year=2023, sem=2, marks=78),
            Marks(name="Charlie Brown", subject="Biology", year=2024, sem=1, marks=88),
            Marks(name="David Lee", subject="English", year=2024, sem=2, marks=92)
        ]

        db.session.bulk_save_objects(dummy_data)
        db.session.commit()
        print("Dummy data inserted into Marks table")


@app.route("/")
def home():
    marks_records = Marks.query.all()
    return render_template("home.html", marks=marks_records)


@app.route("/add_mark", methods=["POST"])
def add_mark():
    data = request.get_json()

    if not all([data.get("name"), data.get("subject"), data.get("year"), data.get("sem"), data.get("marks")]):
        return jsonify({"success": False, "error": "Missing fields"}), 400

    try:
        new_mark = Marks(
            name=data["name"],
            subject=data["subject"],
            year=int(data["year"]),
            sem=int(data["sem"]),
            marks=int(data["marks"])
        )
        db.session.add(new_mark)
        db.session.commit()
        return jsonify({"success": True, "id": new_mark.id})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ✅ Edit a record
@app.route("/edit_mark/<int:id>", methods=["POST"])
def edit_mark(id):
    data = request.get_json()
    mark = Marks.query.get(id)

    if not mark:
        return jsonify({"success": False, "error": "Record not found"}), 404

    try:
        mark.name = data["name"]
        mark.subject = data["subject"]
        mark.year = int(data["year"])
        mark.sem = int(data["sem"])
        mark.marks = int(data["marks"])
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ✅ Delete a record
@app.route("/delete_mark/<int:id>", methods=["DELETE"])
def delete_mark(id):
    mark = Marks.query.get(id)

    if not mark:
        return jsonify({"success": False, "error": "Record not found"}), 404

    try:
        db.session.delete(mark)
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")
        
        if User.query.filter_by(email=email).first():
            flash("Email already exists!", "danger")
            return redirect(url_for("register"))

        new_user = User(name=name, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        records = db.session.query(User).all()

        for record in records:
            print(record)

        print("Registration successful! Please login.")
        flash("Registration successful! Please login.", "success")
        return redirect(url_for("login"))

    return render_template("register.html")

if __name__ == "__main__":
    app.run(debug=True)
