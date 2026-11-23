let allLabs = [];

fetch("data/labs.json")
.then(res => res.json())
.then(labs => {
    allLabs = labs;
    // 研究室一覧
    const list = document.getElementById("labList");
    labs.forEach(lab => {
        const btn = document.createElement("button");
        btn.textContent = lab.name;
        btn.onclick = function () {
            showLab(lab);
        };
        list.appendChild(btn);
    });

    // 検索ボタン
    document.getElementById("searchBtn")
    .addEventListener("click",function(){
        const keyword = document.getElementById("searchBox").value;
        const result = labs.filter(lab =>
            lab.tags &&
            lab.tags.some(tag => tag.includes(keyword))
        );
        list.innerHTML = "";
        result.forEach(lab =>{
            createLabButton(lab, list);
        });
    });
});

// 研究室表示
function showLab(lab){
    document.getElementById("detailArea").innerHTML = `
        <h2>${lab.name}</h2>
        <p>厳しさ：${lab.difficulty ?? "調査中"}</p>
        <p>雰囲気：${lab.atmosphere || "調査中"}</p>
        <p>院進率：${lab.masterRate ?? "調査中"}</p>

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
function createLabButton(lab, list){
    const btn = document.createElement("button");

    btn.textContent = lab.name;

    btn.onclick = function(){
        showLab(lab);
    };

    list.appendChild(btn);
}