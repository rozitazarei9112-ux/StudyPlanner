// ---------- خوش آمدگویی ----------
document.getElementById("welcome").textContent =
    "خوش آمدید!";

// ---------- اضافه کردن درس ----------
function addTask() {
    let input = document.getElementById("taskInput");
    if(input.value === "") return;
    let li = document.createElement("li");
    li.textContent = input.value;
    document.getElementById("taskList").appendChild(li);
    input.value = "";

    // یادآوری درس بعد از 5 دقیقه
    setReminder(li.textContent, 5);
}

// ---------- هدف هفتگی ----------
let weeklyGoal = 0;
function setGoal() {
    weeklyGoal = document.getElementById("goalInput").value;
    if(weeklyGoal <= 0) {
        alert("لطفا عددی بزرگتر از صفر وارد کنید!");
        return;
    }
    document.getElementById("goalDisplay").textContent = weeklyGoal;
    updateProgress();
}

// ---------- تایمر مطالعه هوشمند ----------
let time = 0;
let totalMinutes = 0;
let interval = null;

function startTimer() {
    if(weeklyGoal == 0) {
        alert("لطفا اول هدف هفتگی را ثبت کنید!");
        return;
    }

    time = 25 * 60;

    clearInterval(interval);
    interval = setInterval(function() {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        document.getElementById("timer").textContent =
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        time--;

        if(time < 0) {
            clearInterval(interval);
            totalMinutes += 25;
            updateProgress();
            time = 25 * 60;
            alert("جلسه مطالعه تمام شد!");
            giveScore();
        }
    }, 1000);
}

// ---------- محاسبه درصد پیشرفت ----------
function updateProgress() {
    if(weeklyGoal == 0) return;
    let percent = (totalMinutes / (weeklyGoal * 60)) * 100;
    if(percent > 100) percent = 100;
    document.getElementById("progress").textContent = percent.toFixed(1) + "%";

    // به روز رسانی نمودار
    progressChart.data.datasets[0].data[0] = percent.toFixed(1);
    progressChart.data.datasets[0].backgroundColor = [
        percent > 75 ? '#33cc33' : percent > 50 ? '#ffcc00' : percent > 25 ? '#ff9933' : '#ff6666'
    ];
    progressChart.update();
}

// ---------- امتیازدهی به خودت ----------
function giveScore() {
    let score = prompt("به خودت امتیاز بده (1 تا 5):");
    score = parseInt(score);
    if(isNaN(score) || score < 1 || score > 5) {
        alert("لطفا عددی بین 1 تا 5 وارد کنید!");
        return;
    }
    alert("امتیاز شما ثبت شد: " + score + " از 5");
}

// ---------- یادآوری درس ----------
function setReminder(taskName, minutesLater) {
    if(!("Notification" in window)) {
        alert("مرورگر شما از یادآوری پشتیبانی نمی‌کند.");
        return;
    }

    Notification.requestPermission().then(permission => {
        if(permission === "granted") {
            setTimeout(() => {
                new Notification("یادآوری مطالعه", {
                    body: "وقت مطالعه درس: " + taskName + " است!"
                });
            }, minutesLater * 60 * 1000);
        } else {
            alert("لطفا اجازه نمایش نوتیفیکیشن بدهید!");
        }
    });
}

// ---------- نمودار پیشرفت ----------
const ctx = document.getElementById('progressChart').getContext('2d');
const progressChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['پیشرفت من'],
        datasets: [{
            label: 'درصد پیشرفت',
            data: [0],
            backgroundColor: ['#ff9999'],
            borderColor: ['#cc0000'],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});