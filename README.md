# 🤖 AI Project Topic Recommender

### Free Online AI & Data Science Internship – Student Support Domain

**Task ID:** AI-SS-003
**Project:** AI Project Topic Recommender
**Domain:** Student Support & Internship Management NLP
**Internship:** Free Online AI & Data Science Internship
**Company:** Data Alcott Systems
**Student:** Dharam Pranay Reddy
**Student Code:** DAS009224
**Internship Type:** Online / Work From Home

---

## 📌 Project Overview

The **AI Project Topic Recommender** is an intelligent recommendation system that suggests suitable project topics to students based on their **interests, technical skills, experience level, and preferred domains**.

The system uses **Natural Language Processing (NLP)**, **TF-IDF Vectorization**, and **Cosine Similarity** to compare a student's profile with available project topics and generate personalized recommendations.

---

## 🎯 Objectives

* Recommend relevant project topics to students.
* Analyze student interests and technical skills.
* Apply NLP techniques for text preprocessing.
* Convert text into numerical vectors using TF-IDF.
* Calculate similarity using Cosine Similarity.
* Generate Top-N personalized recommendations.
* Filter recommendations based on difficulty and domain.

---

## 🛠️ Technologies Used

| Technology        | Purpose                            |
| ----------------- | ---------------------------------- |
| Python            | Main programming language          |
| Pandas            | Data processing                    |
| NumPy             | Numerical operations               |
| NLTK              | NLP preprocessing                  |
| Scikit-learn      | TF-IDF and similarity calculation  |
| TF-IDF            | Text vectorization                 |
| Cosine Similarity | Recommendation matching            |
| GitHub            | Source code and project submission |

### Optional Technologies

* Flask / Django
* spaCy
* Transformers / BERT
* LDA Topic Modeling
* Matplotlib
* Seaborn

---

## 🧠 How the System Works

```text
Student Profile
      ↓
Interests + Skills
      ↓
Text Preprocessing
      ↓
Tokenization & Lemmatization
      ↓
TF-IDF Vectorization
      ↓
Project Topic Vectors
      ↓
Cosine Similarity
      ↓
Similarity Ranking
      ↓
Top-N Recommendations
      ↓
Domain / Difficulty Filtering
```

---

## ⭐ Core Features

### 1. Student Interest Profile

The system stores student information such as:

* Interests
* Technical skills
* Experience level
* Preferred domain

### 2. Project Topic Database

The project contains sample topics from domains such as:

* Healthcare
* Finance
* Automotive
* Agriculture
* E-Commerce
* Social Media
* Energy
* Customer Service

### 3. Text Preprocessing

The NLP pipeline performs:

* Lowercase conversion
* Special character removal
* Tokenization
* Stop-word removal
* Lemmatization

### 4. TF-IDF Vectorization

TF-IDF converts student profiles and project descriptions into numerical vectors so that they can be compared mathematically.

### 5. Cosine Similarity

Cosine Similarity measures how closely a student's profile matches each project topic.

A higher similarity score indicates a better recommendation.

### 6. Top-N Recommendations

The system ranks project topics according to similarity and returns the best matching topics.

### 7. Filtering

Recommendations can be filtered based on:

* Difficulty level
* Project domain
* Technical requirements

---

## 📂 Sample Project Topics

| ID   | Project Topic                                      | Domain           | Difficulty   |
| ---- | -------------------------------------------------- | ---------------- | ------------ |
| T001 | AI-Powered Chatbot for Mental Health Support       | Healthcare       | Intermediate |
| T002 | Predictive Maintenance Using Machine Learning      | Industrial       | Advanced     |
| T003 | Real-Time Object Detection for Autonomous Vehicles | Automotive       | Advanced     |
| T004 | Fraud Detection in Financial Transactions          | Finance          | Intermediate |
| T005 | Sentiment Analysis on Social Media Data            | Social Media     | Beginner     |
| T006 | Smart Agriculture Using IoT and AI                 | Agriculture      | Intermediate |
| T007 | Healthcare Diagnosis with Deep Learning            | Healthcare       | Advanced     |
| T008 | Recommendation System for E-Commerce               | E-Commerce       | Intermediate |
| T009 | NLP for Customer Support                           | Customer Service | Beginner     |
| T010 | Energy Consumption Prediction Using Time Series    | Energy           | Intermediate |

---

## 🔍 Recommendation Example

For a student with:

```text
Interests:
Healthcare, NLP, Chatbot

Skills:
Python, NLP, Transformers
```

The system may recommend:

```text
🎯 AI Project Topic Recommendations

1. AI-Powered Chatbot for Mental Health Support
   Domain: Healthcare
   Difficulty: Intermediate
   Duration: 4 weeks
   Match Score: High

2. NLP for Customer Support
   Domain: Customer Service
   Difficulty: Beginner
   Duration: 3 weeks

3. Sentiment Analysis on Social Media Data
   Domain: Social Media
   Difficulty: Beginner
   Duration: 3 weeks
```

The ranking is generated automatically using TF-IDF and Cosine Similarity.

---

## 📁 Project Structure

```text
AI-Project-Topic-Recommender/
│
├── README.md
├── project_topic_recommender.py
├── requirements.txt
├── topics.csv
├── students.csv
│
├── screenshots/
│   └── recommendation_output.png
│
└── demo/
    └── demo_video_link.txt
```

---

## ⚙️ Installation

### Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd AI-Project-Topic-Recommender
```

### Step 2: Install Required Libraries

```bash
pip install pandas numpy scikit-learn nltk
```

Or use:

```bash
pip install -r requirements.txt
```

### Step 3: Download NLTK Resources

Run Python and download the required resources:

```python
import nltk

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
```

### Step 4: Run the Project

```bash
python project_topic_recommender.py
```

---

## 📦 requirements.txt

```text
pandas
numpy
scikit-learn
nltk
```

---

## 🔬 Methodology

The recommendation process consists of the following steps:

### Step 1 – Data Collection

Student profiles and project topic information are created using Python dictionaries, CSV files, or Pandas DataFrames.

### Step 2 – Text Preprocessing

The system cleans the text and removes unnecessary words and characters.

### Step 3 – Feature Extraction

TF-IDF is applied to convert text into numerical feature vectors.

### Step 4 – Similarity Calculation

Cosine Similarity compares the student's profile vector with project topic vectors.

### Step 5 – Ranking

Topics are sorted according to their similarity scores.

### Step 6 – Recommendation

The Top-N most relevant project topics are displayed to the student.

### Step 7 – Filtering

Students can further filter recommendations based on difficulty or domain.

---

## 📊 Evaluation

Recommendation quality can be evaluated using:

* Precision@K
* Recall@K
* Cosine similarity scores
* Student feedback
* Recommendation relevance

---

## 🚀 Bonus Features

The project can be extended with:

* ⭐ Topic clustering
* ⭐ Trending project analysis
* ⭐ Difficulty filtering
* ⭐ Technology/skill matching
* ⭐ User feedback system
* ⭐ Topic visualization
* ⭐ Flask/Django web interface
* ⭐ BERT-based semantic recommendations
* ⭐ LDA topic modeling
* ⭐ Personalized recommendation history

---

## 📅 1-Week Development Timeline

| Day   | Work                                            |
| ----- | ----------------------------------------------- |
| Day 1 | Research, planning and environment setup        |
| Day 2 | Prepare project topic and student datasets      |
| Day 3 | Implement TF-IDF vectorization                  |
| Day 4 | Implement Cosine Similarity and recommendations |
| Day 5 | Add filtering and recommendation improvements   |
| Day 6 | Testing and optional bonus features             |
| Day 7 | Documentation, GitHub upload and submission     |

---

## 🧪 Testing

The system should be tested using different student profiles.

Example test cases:

```text
Student interested in Healthcare + NLP
→ Healthcare chatbot / NLP projects

Student interested in Finance + ML
→ Fraud detection / prediction projects

Student interested in Automotive + Computer Vision
→ Object detection projects

Student interested in E-Commerce + Recommendation
→ Recommendation system projects
```

---

## 💡 Learning Outcomes

Through this project, I learned:

* Fundamentals of Natural Language Processing
* Text preprocessing techniques
* TF-IDF vectorization
* Cosine Similarity
* Content-Based Recommendation Systems
* Data processing with Pandas
* Building personalized recommendations
* Evaluating recommendation quality
* Structuring and documenting an AI project

---

## 🔮 Future Enhancements

Future versions can include a web-based interface where students enter their interests and skills and receive recommendations instantly.

The system can also be improved using **BERT/Transformer embeddings** to understand semantic relationships between student profiles and project descriptions more effectively than traditional keyword-based similarity.

---

## 👨‍💻 Author

**Dharam Pranay Reddy**
**Student Code:** DAS009224

### Internship Task

**Task ID:** AI-SS-003
**Task Name:** AI Project Topic Recommender
**Domain:** Student Support & Internship Management NLP

---

## 📌 Internship Submission

**Company:** Data Alcott Systems
**Internship:** Free Online AI & Data Science Internship
**Mode:** Online / Work From Home

### Submission Checklist

* [x] Python source code
* [x] NLP preprocessing
* [x] TF-IDF vectorization
* [x] Cosine Similarity
* [x] Top-N recommendations
* [x] Difficulty filtering
* [x] Domain filtering
* [x] README documentation
* [ ] Demo video
* [ ] GitHub repository link
* [ ] Final task submission

---

## ⭐ Conclusion

The **AI Project Topic Recommender** provides students with personalized project suggestions by analyzing their interests and technical skills. By combining NLP, TF-IDF, and Cosine Similarity, the system provides a simple and effective content-based recommendation approach.

This project demonstrates the practical application of **Artificial Intelligence, Natural Language Processing, and Machine Learning** in student support and internship management.

---

**Developed by D Pranay Reddy | AI & Data Science Internship | Task AI-SS-003**
