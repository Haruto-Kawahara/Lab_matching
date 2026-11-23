let allLabs = [];
let currentQuestion = "q1";
let selectedTags = [];

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

    //  研究室表示
    displayLabs(labs, list);

    // 検索ボタン
    document.getElementById("searchBtn")
    .addEventListener("click", function(){
        const keyword =
        document.getElementById("searchBox").value;
        const result = allLabs.filter(lab =>
            lab.tags &&
            lab.tags.some(tag =>
                tag.includes(keyword)
            )
        );
        displayLabs(result, list);
    });

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

function showDiagnosisResult(){
    const scores = allLabs.map(lab => {
        let score = 0;

        selectedTags.forEach(tag => {
            if(lab.tags && lab.tags.includes(tag)) score++;
        });

        return {
            name : lab.name,
            score : score
        };
    });

    scores.sort((a,b) => b.score - a.score);
    const top3 = scores.slice(0,3);

    document.getElementById("buttons")
        .style.display = "none";
    document.getElementById("result")
        .innerHTML =
`
        <h3>おすすめ研究室</h3>

        <p>1位 ${top3[0].name}
        (${top3[0].score}点)</p>
        <p>2位 ${top3[1].name}
        (${top3[1].score}点)</p>
        <p>3位 ${top3[2].name}
        (${top3[2].score}点)</p>
        `;
}

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