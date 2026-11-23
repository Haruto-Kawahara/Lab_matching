fetch("labs.json")
.then(res => res.json())
.then(labs => {
    const list = document.getElementById("labList");
    labs.forEach(lab => {
        const btn = document.createElement("button");
        btn.textContent = lab.name;
        btn.onclick = function () {
            document.getElementById("detailArea").innerHTML = `
                <h2>${lab.name}</h2>

                <p>厳しさ：${lab.difficulty ?? "不明"}</p>

                <p>雰囲気：${lab.atmosphere || "不明"}</p>

                <p>院進率：${lab.masterRate ?? "不明"}</p>

                <h3>研究内容</h3>

                <ul>
                    ${lab.research.map(r =>
                        `<li>${r}</li>`).join("")
                    }
                </ul>

                <h3>口コミ</h3>

                <ul>
                    ${lab.review.map(r =>
                        `<li>${r}</li>`).join("")
                    }
                </ul>
            `;
        };

        list.appendChild(btn);
    });
});