$(document).ready(function () {
    // โหลดข้อสอบจากไฟล์ JSON
    $.getJSON("questions.json", function (data) {
        let questions = data.questions;
        let currentQuestionIndex = 0; // เริ่มต้นที่คำถามแรก
        let score = 0;
        let userAnswers = [];
        const questionsPerPage = 5; // แสดง 5 ข้อต่อหน้า



        // ฟังก์ชันแสดงคำถาม
        function showQuestions(index) {
            let questionHtml = "";

            // วนลูปแสดงคำถามทีละ 5 ข้อ
            for (let i = index; i < index + questionsPerPage && i < questions.length; i++) {
                let question = questions[i];
                questionHtml += `<div class="question-block">
                    <p><strong>ข้อที่ ${i + 1}:</strong> ${question.question}</p>`;
                question.options.forEach(function (option, optionIndex) {
                    questionHtml += `
                        <label>
                            <input type="radio" name="question-${i}" value="${optionIndex}"> ${option}
                        </label><br>`;
                });
                questionHtml += `</div>`;
            }

            $("#questionContainer").html(questionHtml);
            $("#nextButton").show(); // แสดงปุ่มถัดไป
        }

        // เมื่อเริ่มทำข้อสอบ
        $("#startButton").click(function () {
            $("#intro").hide();
            $("#quiz").show();
            showQuestions(currentQuestionIndex); // แสดงคำถามแรก
        });

        // เมื่อกดปุ่ม "ถัดไป"
        $("#nextButton").click(function () {
            let unanswered = false;

            // ตรวจสอบว่าทุกคำถามในหน้านี้มีคำตอบหรือไม่
            for (let i = currentQuestionIndex; i < currentQuestionIndex + questionsPerPage && i < questions.length; i++) {
                let selectedAnswer = $(`input[name='question-${i}']:checked`).val();
                if (selectedAnswer === undefined) {
                    unanswered = true;
                    break;
                } else {
                    userAnswers.push({
                        question: questions[i].question,
                        userAnswer: parseInt(selectedAnswer),
                        correctAnswer: questions[i].correctAnswer
                    });

                    // เพิ่มคะแนนหากคำตอบถูกต้อง
                    if (parseInt(selectedAnswer) === questions[i].correctAnswer) {
                        score++;
                    }
                }
            }

            if (unanswered) {
                alert("กรุณาตอบคำถามทั้งหมดก่อนจะไปยังหน้าถัดไป");
            } else {
                currentQuestionIndex += questionsPerPage; // ไปยังชุดคำถามถัดไป

                // ถ้ามีคำถามถัดไปให้แสดง
                if (currentQuestionIndex < questions.length) {
                    showQuestions(currentQuestionIndex);
                } else {
                    // ถ้าทำข้อสอบเสร็จแล้ว
                    $("#quiz").hide();
                    $("#result").show();
                    $("#score").text(score); // แสดงคะแนน
                }
            }
        });

        // ฟังก์ชันแสดงรายละเอียดคำตอบ
        function showAnswerDetails() {
            let answerDetailsHtml = "<h3>รายละเอียดคำตอบ:</h3>";
            userAnswers.forEach(function (answer, index) {
                let isCorrect = answer.userAnswer === answer.correctAnswer;
                let resultText = isCorrect ? "<span style='color:green;'>ถูกต้อง</span>" : "<span style='color:red;'>ผิด</span>";
                let correctAnswerText = questions[index].options[answer.correctAnswer];
                let userAnswerText = questions[index].options[answer.userAnswer];

                answerDetailsHtml += `<p>
                    <strong>ข้อที่ ${index + 1}:</strong> ${answer.question}<br>
                    คำตอบที่เลือก: ${userAnswerText} (${resultText})<br>
                    คำตอบที่ถูกต้อง: ${correctAnswerText}
                </p>`;
            });
            $("#answerDetails").html(answerDetailsHtml); // แสดงคำตอบทั้งหมด
        }

        // ฟังก์ชันตรวจคำตอบเมื่อกดปุ่มตรวจคำตอบ
        $("#submitAnswers").click(function () {
            showAnswerDetails(); // แสดงรายละเอียดคำตอบ
            alert(`คุณได้คะแนนทั้งหมด: ${score} คะแนน
ต้องการตรวจสอบรายละเอียดคำตอบ?`);
        });
    }).fail(function (jqxhr, textStatus, errorThrown) {
        console.error("ไม่สามารถโหลดไฟล์ JSON ได้:", textStatus, errorThrown);
    });
});
