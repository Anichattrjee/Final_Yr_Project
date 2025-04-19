from flask import Flask, render_template, request, redirect
import pickle, cv2, os, csv, time
from datetime import datetime
from sklearn.neighbors import KNeighborsClassifier
from collections import Counter

app = Flask(__name__)

# Initialize face detector and KNN model
facedetect = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Load the trained model and labels
with open('data/names.pkl', 'rb') as f:
    LABELS = pickle.load(f)
with open('data/faces_data.pkl', 'rb') as f:
    FACES = pickle.load(f)

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(FACES, LABELS)

identified_user = None
voted_users = set()

@app.route('/')
def index():
    return render_template('index.html', user=identified_user)

@app.route('/detect', methods=['POST'])
def detect():
    global identified_user
    video = cv2.VideoCapture(0)
    ret, frame = video.read()
    video.release()

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = facedetect.detectMultiScale(gray, 1.3, 5)

    if len(faces) > 0:
        (x, y, w, h) = faces[0]
        crop_img = frame[y:y+h, x:x+w]
        resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)
        identified_user = knn.predict(resized_img)[0]
    
    return redirect('/')

@app.route('/vote', methods=['POST'])
def vote():
    global identified_user
    if not identified_user or identified_user in voted_users:
        return "Vote already cast or user not identified"

    party = request.form.get('party')
    ts = time.time()
    date = datetime.fromtimestamp(ts).strftime("%d-%m-%Y")
    timestamp = datetime.fromtimestamp(ts).strftime("%H:%M:%S")

    with open("Votes.csv", "a", newline='') as csvfile:
        writer = csv.writer(csvfile)
        if csvfile.tell() == 0:
            writer.writerow(['NAME', 'VOTE', 'DATE', 'TIME'])
        writer.writerow([identified_user, party, date, timestamp])

    voted_users.add(identified_user)
    return redirect('/')

@app.route('/admin')
def admin():
    vote_counts = Counter()
    if os.path.exists('Votes.csv'):
        with open('Votes.csv', 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                vote_counts[row['VOTE']] += 1
    
    return render_template('admin.html', results=vote_counts)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)