# 🎓 LMS UE Admin – Dashboard by Pirate Coderz ⚓

A modern, responsive admin dashboard for a University LMS system — built with **React**, **Redux Toolkit**, and **Material UI**.

This dashboard allows university administrators to manage departments, students, teachers, assignments, fee structures, timetables, and more.  
Built with clean architecture, reusable components, and production-ready linting & formatting.

> 👨‍💻 Developed with ❤️ by [Ahmad Raza](https://www.linkedin.com/in/ahmad-raza0) under **Pirate Coderz**

---

## ⚙️ Tech Stack

- ⚛️ React 18
- 🎯 Redux Toolkit
- 💅 Material UI 5
- 📦 Axios
- 📁 CSV to JSON Import
- 📊 ApexCharts + Chart Cards
- 🔐 Form Validation with React Hook Form
- ☁️ Cloudinary File Upload
- 🍞 React Toastify
- 🧼 ESLint + Prettier (Airbnb config)

---

## 📁 Folder Structure

```

lms-ue-admin/
├── src/
│   ├── assets/
│   ├── components/
│   ├── features/        # Redux slices & async logic
│   ├── layouts/
│   ├── pages/
│   ├── sections/        # Views like dashboard, users, assignments
│   ├── services/        # Axios wrappers
│   ├── utils/           # Helper functions
│   └── App.jsx
├── public/
├── .eslintrc
└── package.json

````

---

## 🚀 Setup & Run

```bash
# Clone the repo
git clone https://github.com/piratecoderz/lms-ue-admin.git
cd lms-ue-admin

# Install dependencies
yarn install 

# Start dev server
yarn start
````

---

## ✅ Key Features

* 🧑‍🎓 **Student Management** – add, edit, view, bulk import
* 👨‍🏫 **Teacher Management**
* 🏢 **Department CRUD**
* 🧾 **Assignment + Quiz Upload/Tracking**
* 📚 **Material Upload (Cloudinary)**
* 📅 **Timetable Builder**
* 🪙 **Fee Structure per Department**
* 📈 **Merit List UI**
* 📦 **CSV Upload Support**
* ✨ **Dark/Light Mode UI Toggle**
* 🎨 **Fully Responsive Dashboard**

---

## 🔒 Linting & Formatting

This project uses:

* `eslint-config-airbnb`
* `prettier` integration
* Custom `.eslintrc` rules

Run:

```bash
yarn lint        # Check code style
yarn lint:fix    # Auto-fix issues
```

---

## 🧠 Scripts

```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "lint": "eslint --ext .js,.jsx ./src",
  "lint:fix": "eslint --fix --ext .js,.jsx ./src",
  "clear-all": "rm -rf build node_modules",
  "re-start": "rm -rf build node_modules && yarn install && yarn start",
  "re-build": "rm -rf build node_modules && yarn install && yarn build"
}
```

---

## 📜 License

This project is licensed under the **Apache 2.0 License**.
See [LICENSE](./LICENSE) for full details.

---

## 🧠 Author

**Ahmad Raza** – Frontend Engineer
💻 [LinkedIn](https://www.linkedin.com/in/ahmad-raza0)
⚓ Founder of Pirate Coderz

> Let’s connect. If your current dashboard feels clunky or unscalable — **let’s talk about building one that actually works** 🚀

---
