let allLabs = [];
let currentQuestion = "q1";
let selectedTags = [];
// 再診断ボタン
document.getElementById("restartBtn").addEventListener("click",restartDiagnosis);

// 質問
const questions = {
    q1 : {
        text : "院進希望ですか？",
        tag : "院進",
        next : "q2"
    },
    q2 : {
        text : "AIに興味がありますか？",
        tag : "AI",
        next : "q3"
    },
    q3 : {
        text : "IoTに興味がありますか？",
        tag : "IoT",
        next : "q4"
    },
    q4 : {
        text : "セキュリティに興味がありますか？",
        tag : "情報セキュリティ",
        next : "q5"
    },
    q5 : {
        text : "強化学習、機械学習に興味がありますか？",
        tag : "機械学習",
        next : null
    }
};

fetch("data/labs.json")
.then(res => res.json())
.then(labs => {
    allLabs = labs;
    let list = document.getElementById("labList");
    const tagArea = document.getElementById("tagArea");
    const allTags = [...new Set(
        labs.flatMap(lab => lab.tags || [])
    )];
    allTags.sort();
    allTags.forEach(tag => {
        const btn = document.createElement("button");
        btn.textContent = tag;
        btn.onclick = function(){
            const result = labs.filter(lab =>
                lab.tags && lab.tags.includes(tag)
            );
            displayLabs(result, list);
        };
        tagArea.appendChild(btn);
    });

    displayLabs(labs, list);
    showQuestion();
});


// 関数--------------

// 研究室表示
function showLab(lab){
    document.getElementById("detailArea").innerHTML = `
        <h2>${lab.name}</h2>
        <p>厳しさ：${makeStars(lab.difficulty) ?? "調査中"}</p>
        <p>雰囲気：${lab.atmosphere || "調査中"}</p>
        <p>院進率：${makeStars(lab.masterRate) ?? "調査中"}</p>

        <h3>研究内容</h3>
        <ul>
            ${lab.research.map(r => `<li>${r}</li>`).join("")}
        </ul>
        <h3>口コミ</h3>
        <ul>
            ${lab.review.map(r => `<li>${r}</li>`).join("")}
        </ul>
        <h4>タグ</h4>
        <p>${lab.tags ? lab.tags.join(" / ") : "未設定"}</p>
    `;
}

// 研究室表示
function displayLabs(labs, list){
    list.innerHTML = "";
    labs.forEach(lab => {
        const btn = document.createElement("button");
        btn.textContent = lab.name;
        btn.onclick = function(){
            showLab(lab);
        };
        list.appendChild(btn);
    });
}

// 5段階評価★☆☆☆☆
function makeStars(num){
    if(num == null) return "調査中";
    return "★".repeat(num) + "☆".repeat(5-num);
}

// 質問
function showQuestion(){
    const q = questions[currentQuestion];
    document.getElementById("question")
        .textContent = q.text;
}

// 診断結果
function showDiagnosisResult(){
    const scores = allLabs.map(lab => {
        let score = 0;
        const matchedTags = [];
        selectedTags.forEach(tag => {
        if(lab.tags && lab.tags.includes(tag)){
            score++;
            matchedTags.push(tag);
        }
        });
        return {
            lab : lab,
            score : score,
            matchedTags : matchedTags
        };
    });
    scores.sort((a,b) => b.score - a.score);
    const top3 = scores.slice(0,3);
    document.getElementById("buttons").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("result")
    .innerHTML = `
        <h3>おすすめ研究室</h3>
        ${createRankingLab(top3[0])}
        ${createRankingLab(top3[1])}
        ${createRankingLab(top3[2])}
    `;
    document.getElementById("restartBtn").style.display = "inline-block";   
}

// 解答(y/n)
function answer(choice){
    const q = questions[currentQuestion];
    if(choice === "yes") selectedTags.push(q.tag);
    if(q.next === null){
        showDiagnosisResult();
        return;
    }
    currentQuestion = q.next;
    showQuestion();
}

// 再診断
function restartDiagnosis(){
    currentQuestion = "q1";
    selectedTags = [];
    document.getElementById("buttons").style.display = "";
    document.getElementById("result").innerHTML = "";
    document.getElementById("result").style.display = "none";
    document.getElementById("restartBtn").style.display = "none";
    showQuestion();
}

function showLabByName(name){
    const lab = allLabs.find(l => l.name === name);
    if(lab) showLab(lab);
}

// 診断結果表示
function createRankingLab(rankData){
    return `
        <div class="rankingItem">
            <button onclick="showLabByName('${rankData.lab.name}')">
                ${rankData.lab.name}
            </button>
            <br>
            ${rankData.score}点
            <br>
            タグ:
            ${rankData.matchedTags.join(" / ")}
            <br>
            <br>
        </div>
    `;
}