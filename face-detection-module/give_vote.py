from flask import Flask, render_template, request, redirect
import cv2
import pickle
import numpy as np
import os
import csv
import time
from datetime import datetime

app = Flask(__name__)


# Load training data
with open('data/names.pkl', 'rb') as f:
    LABELS = pickle.load(f)
with open('data/faces_data.pkl', 'rb') as f:
    FACES = pickle.load(f)

from sklearn.neighbors import KNeighborsClassifier
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(FACES, LABELS)

def check_if_voted(voter_name):
    try:
        with open("Votes.csv", "r") as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if row and row[0] == voter_name:
                    return True
    except FileNotFoundError:
        return False
    return False

@app.route('/')
def index():
    video = cv2.VideoCapture(0)
    facedetect = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    identified_name = None

    while True:
        ret, frame = video.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = facedetect.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            crop_img = frame[y:y+h, x:x+w]
            resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)
            output = knn.predict(resized_img)
            identified_name = output[0]
            break

        if identified_name:
            break

        cv2.imshow("Detecting...", frame)
        if cv2.waitKey(1) == 27:
            break

    video.release()
    cv2.destroyAllWindows()

    if identified_name:
        if check_if_voted(identified_name):
            return f"<h2>{identified_name}, you have already voted!</h2>"
        return render_template("vote.html", name=identified_name)
    else:
        return "<h2>No face detected. Try again.</h2>"
from collections import Counter

@app.route('/admin')
def admin():
    votes = []
    if os.path.isfile("Votes.csv"):
        with open("Votes.csv", "r") as csvfile:
            reader = csv.reader(csvfile)
            next(reader)  # skip header
            for row in reader:
                if row:
                    votes.append(row[1])  # party name

    vote_counts = Counter(votes)
    return render_template("admin.html", results=vote_counts)

@app.route('/vote', methods=['POST'])
def vote():
    name = request.form['voter']
    party = request.form['party']
    ts = time.time()
    date = datetime.fromtimestamp(ts).strftime("%d-%m-%Y")
    timestamp = datetime.fromtimestamp(ts).strftime("%H:%M-%S")
    exist = os.path.isfile("Votes.csv")

    with open("Votes.csv", "a") as csvfile:
        writer = csv.writer(csvfile)
        if not exist:
            writer.writerow(['NAME', 'VOTE', 'DATE', 'TIME'])
        writer.writerow([name, party, date, timestamp])

    return f"<h2>Thank you {name}, your vote for {party} has been recorded!</h2>"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
