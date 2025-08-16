

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Create .env file
   DATABASE_URL="your DB"
   PORT=choise port
   NODE_ENV=development
   ```

4. **Set up database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the server:**
   ```bash
   npm run start:dev
   ```
    ### APi
    1. `POST /quizzes` – Create a new quiz
    2. `GET /quizzes` – Return a list of all quizzes with titles and number of questions
    3. `GET /quizzes/:id` – Return full details of a quiz including all questions
    4. `DELETE /quizzes/:id` – Delete a quiz


### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:3002
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:3000`


### Quizzes
- `POST /quizzes` - Create a new quiz
- `GET /quizzes` - Get all quizzes with question count
- `GET /quizzes/:id` - Get quiz details with questions
- `DELETE /quizzes/:id` - Delete a quiz

## 🎯 Usage

### Creating a Quiz
1. Navigate to `/create` page
2. Enter quiz title
3. Add questions with appropriate types
4. Set correct answers
5. Submit the quiz

### Taking a Quiz
1. Go to quiz details page
2. Click "Take Quiz" button
3. Answer questions one by one
4. Submit and view results
5. Option to retake the quiz

### Managing Quizzes
- View all quizzes on `/quizzes` page
- Delete quizzes using the delete button
- Navigate to quiz details for more information

## 🔧 Development

### Running Tests
```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## 🌟 Key Features Implementation

- **Form Validation**: Client and server-side validation using class-validator
- **Real-time Progress**: Progress bar and question navigation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Database Relations**: Proper relationships between quizzes and questions
- **Error Handling**: Comprehensive error handling and user feedback

## 📱 Screenshots

*Add screenshots of your application here*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍�� Author

**Markiyan Kits**

---

## �� Project Status

**✅ COMPLETED**

This project has been successfully implemented with all required features including:
- Full-stack quiz builder application
- RESTful API with proper validation
- Interactive quiz taking experience
- Responsive and modern UI
- Comprehensive error handling
- Type-safe implementation

**Completed by: Markiyan Kits**