$(function () {
    var data = [];
    var mines = 0;
    var misplaced = 0;

    function getData(i, j) {
        if (i < 0 || i >= data.length || j < 0 || j >= data[0].length) {
            return {};
        }
        return data[i][j];
    }

    function makeData(height, width) {
        for (var i = 0; i < height; i++) {
            data[i] = [];
            for (var j = 0; j < width; j++) {
                data[i][j] = {
                    number: 0,
                    status: 0, // 0, 1, 2
                    hasMine: 0
                };
            }
        }

        function makeTheMines(percentage) {
            for (var i = 0; i < height; i++) {
                for (var j = 0; j < width; j++) {
                    var random = Math.floor(Math.random() * 100);
                    if (random <= percentage) {
                        mines++;
                        getData(i, j).hasMine = 1;

                        getData(i + 1, j + 1).number += 1;

                        getData(i - 1, j + 1).number += 1;

                        getData(i + 1, j - 1).number += 1;

                        getData(i - 1, j - 1).number += 1;

                        getData(i, j + 1).number += 1;

                        getData(i + 1, j).number += 1;

                        getData(i, j - 1).number += 1;

                        getData(i - 1, j).number += 1;
                    }
                }
            }
        }

        makeTheMines(7);
    }

    function onClickCell(event) {
        var e = $(event.target);
        var row = e.data("row"), col = e.data("col");
        // debugger;
        console.log("left: ", row, col);
        if (data[row][col].hasMine == 1) {
            alert('you LOSE!');
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[0].length; j++) {
                    data[i][j].status = 1;
                }
            }

        } else if (data[row][col].hasMine == 0) {
            var q = [];
            q.push([row, col]);
            while (q.length > 0) {
                var t = q.shift();
                changeTarget(t[0], t[1]);
            }

            function changeTarget(row, col) {
                var d = getData(row, col);
                if (d.status !== 0 || d.hasMine || d.number > 0) {
                    d.status = 1;
                    return;
                }
                d.status = 1;
                [
                    [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
                    [row, col - 1], [row, col + 1],
                    [row + 1, col - 1], [row + 1, col], [row + 1, col + 1]
                ].forEach(function (p) {
                    var r1 = p[0], c1 = p[1];
                    if (r1 < 0 || r1 >= data.length || c1 < 0 || c1 >= data[0].length) {
                        return;
                    }
                    q.push([r1, c1]);
                });
            }
        }
        updateUI();
    }

    function onRightClickCell(event) {
        var e = $(event.target);
        var row = e.data("row"), col = e.data("col");
        // debugger;
        console.log("right: ", row, col);
        if (data[row][col].status == 2) {
            data[row][col].status = 0;
            if (data[row][col].hasMine) {
                mines++
            } else {
                misplaced--
            }
        }
        if (data[row][col].status == 0) {
            data[row][col].status = 2;
            if (data[row][col].hasMine) {
                mines--
            } else {
                misplaced++
            }
        }
        if (mines == 0 && misplaced == 0) {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[0].length; j++) {
                    !data[i][j].status && (data[i][j].status = 1);
                }
            }
            updateUI();
            alert('You Win!')
        }
        updateUI();
        event.preventDefault();
        return false;
    }

    function updateUI() {
        var body = $("body");
        body.empty();
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                var hasMine = data[i][j].hasMine;
                var showStatus = " ";
                var style = "";
                if (data[i][j].status == 1) {
                    showStatus = hasMine ? "*" : " ";
                    var n = data[i][j].number;
                    if (n > 0 && !hasMine) {
                        showStatus += n;
                    }
                    style = "background:lightGrey;"
                }
                if (data[i][j].status == 2) {
                    style = "background: url('/javascript/done mine.png');"
                }
                var a = $('<button ' +
                    'style="' + style +
                    '" class="screenButton"' +
                    ' data-row="' + i + '" ' +
                    ' data-col="' + j + '"> '
                    + showStatus +
                    '</button>');
                body.append(a);
            }
            var b = $('<br>');
            body
                .append(b);
        }

        $(".screenButton")
            .off()
            .on("click", onClickCell)
            .on("contextmenu", onRightClickCell);
        var help = $('<br><button class="help">show the answer...</button>');
        body.append(help);
    }

    function makeTheScreen(height, width) {
        makeData(height, width);
        updateUI();
    }

    makeTheScreen(15, 15);
    $('.help')
        .on('click', function () {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[0].length; j++) {
                    if (data[i][j].hasMine) {
                        data[i][j].status = 2;
                    } else if (!data[i][j].status) {
                        data[i][j].status = 1;
                    }
                }
            }
            updateUI();
        });
});