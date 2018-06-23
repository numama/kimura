var Koma = {};
// [関数]与えられた配置の配列に従って盤面を生成する -> null
Koma.create = function(position) {
  // #boardのelementを取得
  var $Board = document.getElementById("board");

  // パフォーマンスのためにfragmentを使って1回のDOMアクセスにする
  // fragmentをつくる
  var komaFragment = document.createDocumentFragment();
  // fragmentに要素を入れていく
  position.forEach(function(row, colIndex) {
    row.forEach(function(cell, rowIndex) {
      // div要素を生成
      var $Element = document.createElement("div");
      // cellクラスを付与
      $Element.classList.add("cell");
      // セルIDを付与
      $Element.id = "cell" + (colIndex * 9 + rowIndex + 1);
      // イベントリスナーを設定
      $Element.onclick = function(event) {
        Koma.komaClickHundler_(event.target);
      }
      // 空のオブジェクトならそのまま追加して次のループへ
      if (!Object.keys(cell).length) {
        komaFragment.appendChild($Element);
        return;
      }
      $Element.classList.add(cell["owner"]);
      $Element.classList.add(cell["kind"]);
      komaFragment.appendChild($Element);
    });
  });
  // boardエレメントの子要素に追加する
  $Board.appendChild(komaFragment);
};

// [関数]IDから座標を取得する -> [int, int]
Koma.getCoordinatesById = function(id) {
  var y = parseInt((id - 1) / 9) + 1;
  var x = 9 - (id - 1) % 9;
  return [x, y];
};
// [関数]座標からIDを取得する -> int
Koma.getIdByCoordinates = function(coordinates) {
  return (coordinates[1] - 1) * 9 + (10 - coordinates[0]);
};

// [関数]要素のエレメントを引数に取り、それが先手なのか後手なのか空白なのか -> string
Koma.getOwnerByElement = function($Element) {
  if ($Element.classList.contains("white")) {
    return "white";
  } else if ($Element.classList.contains("black")) {
    return "black";
  } else {
    return "none";
  }
};

// [関数]先手後手、駒の種類、座標を引数にとり、そのセルをその種類のコマに替える -> null
Koma.placeKoma = function(owner, kind, coordinates) {
  var cellId = "cell" + Koma.getIdByCoordinates(coordinates);
  var $Element = document.getElementById(cellId);
  $Element.className = "cell" + " " + owner + " " + kind;
};

// [関数]駒がクリックされたときの処理
Koma.komaClickHundler_ = function($Element) {
  if (Store.getSelectedItem()) {
    var $SelectedElement = Store.getSelectedItem();
    $Element.className = $SelectedElement.className;
    $SelectedElement.className = "cell";
    Store.setSelectedItem(null);
    if (Store.getTurn() === "white") {
      Store.setTurn("black");
    } else {
      Store.setTurn("white");
    }
  } else {
    if (Koma.getOwnerByElement($Element) === Store.getTurn()) {
      Store.setSelectedItem($Element);
      return;
    }
  }
};