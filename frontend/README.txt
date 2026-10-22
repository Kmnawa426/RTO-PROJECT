RTO Connect – citizen portal (React + Vite + Bootstrap 5), matched to your Mongoose models

1) npm install
2) copy .env.example to .env and set VITE_API_URL to your backend (e.g. http://localhost:5000/api)
3) npm run dev      -> open the link it prints (http://localhost:5173)

PAGES / FORMS (input names are exactly your model field names)
  /register         User            FullName, Email, Phone, Password, Address, DateOfBirth, DrivingSchool (JSON)
  /login            User            Email, Password (JSON)
  /apply            Application     ApplicationType, VehicleType, DateOfBirth, Address, DocumentName,
                                    DocumentImage = file (multipart FormData)
  /school-register  DrivingSchool   SchoolName, ContactPerson, Email, Phone, Address, City, Password,
                                    SchoolImage = file (multipart FormData)
  /fines            Fine            search by VehicleNumber; pay sends PaymentMethod (JSON)
  /applications, /training, /driving-test  show Application, Training, DrivingTest data (sample for now)

ROUTES THE FORMS CALL (change them in each page if yours differ; helpers are in src/api.js)
  POST /users/register     POST /users/login      POST /applications (multer: DocumentImage)
  POST /schools/register (multer: SchoolImage)    POST /fines/:id/pay

SERVER-SIDE REMINDERS
  - Hash passwords (bcrypt) before saving; never store them as plain text.
  - Application.User comes from the logged-in user (token/session), not from the form.
  - FineStatus, PaymentDate, TransactionId are set by the server after payment.
  - DrivingSchool.Permission stays false until the admin approves the school.
  - Enable CORS for http://localhost:5173 and credentials if you use cookies.
  - Sample data is at the top of each page file (UPPERCASE lists): replace with fetch() results.
