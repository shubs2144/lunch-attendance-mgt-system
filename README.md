## ** Features**

- Employee attendance marking (Office/Home/Leave)(only weekdays)
- Admin dashboard for analytics
- Chef notifications for lunch count
- JWT authentication
- CORS-enabled backend
- Automated daily emails to chefs at 9:30 AM with office attendance count
- SMTP integration with Gmail/Mailtrap
- Weekend exclusion (no emails on Sat/Sun)

---

## **🛠️ Tech Stack**

| Component      | Technology                           |
| -------------- | ------------------------------------ |
| **Frontend**   | React, Vite, Tailwind CSS            |
| **Backend**    | Node.js, Express                     |
| **Database**   | MongoDB Atlas                        |
| **Deployment** | Netlify (Frontend), Render (Backend) |
| **Email**      | SMTP integration with Gmail/Mailtrap |
---

## ** Setup Guide**

### **1. Clone the Repository**

```bash
git clone https://github.com/shubs2144/lunch-attendance-system.git
cd lunch-attendance-system
```

### **2. Backend Setup**

```bash
cd server
npm install
cp .env.example .env  # Update with your credentials
npm run dev
```

### **3. Frontend Setup**

```bash
cd ../client
npm install
npm run dev
```

### **4. Environment Variables**

Create `.env` files in both folders:  
**Backend (server/.env):**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Frontend (client/.env):**

```env
VITE_API_URL=http://localhost:5000
```



### **5. Email Configuration**

server/.env

SMTP_HOST=smtp.gmail.com  # or sandbox.smtp.mailtrap.io for testing
SMTP_PORT=587
SMTP_EMAIL=your@gmail.com
SMTP_PASSWORD=your-app-password  # Gmail requires app password - 2F validation
FROM_EMAIL=no-reply@attendance.com
FROM_NAME=Attendance System


cd server
npm install nodemailer


---

## \*\*📸 Screenshots

### **0. Registration Page**

![Login Page](./client/public/screenshot/registrationPage.png)  
_User SignUp interface_

### **1. Login Page**

![Login Page](./client/public/screenshot/loginPage.png)  
_User authentication interface_

### **2. Employee Dashboard**

![Employee View](./client/public/screenshot/employeePage.png)  
_Attendance marking interface_

### **3. Admin Analytics**

![Admin View](./client/public/screenshot/adminPage.png)  
_Attendance trends and reports_

### **4. Chef Notification**

![Chef View](./client/public/screenshot/chefPage.png)  
_Chef receiving daily count_

### **4. Sample Email Received**

![Sample Email](./client/public/screenshot/sampleEmailPage.png)  
_Daily lunch count alert_


---

## \*\* API Endpoints

| Endpoint                       | Method | Description                         |
| ------------------------------ | ------ | ----------------------------------- |
| `/api/v1/auth/register`        | POST   | User registration                   |
| `/api/v1/auth/login`           | POST   | User login                          |
| `/api/v1/attendance`           | POST   | Mark attendance                     |
| `/api/v1/attendance/analytics` | GET    | Get attendance reports (Admin only) |

---

## \*\* Deployment

### **Frontend (Netlify)**

1. Push code to GitHub
2. Connect repo to Netlify
3. Set build command: `npm run build`
4. Add environment variable:  
   `VITE_API_URL=https://your-backend.onrender.com`

### **Backend (Render)**

1. Create Docker-based Web Service
2. Set environment variables (MONGODB_URI, JWT_SECRET)
3. Deploy from GitHub

---

## \*\* Troubleshooting

| Issue           | Solution                              |
| --------------- | ------------------------------------- |
| CORS errors     | Verify `cors()` middleware in backend |
| MongoDB timeout | Check Atlas IP whitelist              |
| JWT not working | Verify secret key consistency         |
| Gmail blocking  | Enable "Less secure apps" or use App Password |
| No emails on weekends | Verify cron syntax (1-5 = Mon-Fri)         |
