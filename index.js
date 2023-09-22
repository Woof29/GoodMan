let ramenData;

(async function () {
  let db = getDatabase();
  ramenData = await getRamenData(db);

  //預設全部店家
  printCard(ramenData);

  //搜尋
  searchInput.on("keyup", SearchAction);

  // 開關menu
  hamburgerIcon.on("click", hamburgerMenuRemote);
  dropDownBtn.on("click", showDistrictMenu);
  hamburgerGB.on("click", closeDistrictMenu);

  // 切換區域
  districtMenu.on("click", switchDistrict);
  districtMenu.on("click", closeDistrictMenu);
})();

function getDatabase() {
  const config = {
    databaseURL: "https://goodman-web-default-rtdb.firebaseio.com/",
  };
  return firebase.initializeApp(config).database();
}

async function getRamenData(db) {
  return new Promise((res, rej) => {
    db.ref("taichungRamen").once("value", (snapshot) => {
      const data = snapshot.val();
      res(data);
    });
  });
}

//漢堡選單開關動畫
let hamburgerIcon = $(".hamburgerIcon");
let header = $(".header");
let hamburgerGB = $(".hamburgerBG");
function hamburgerMenuRemote() {
  hamburgerGB.toggleClass("BGtoggle");
  hamburgerIcon.toggleClass("active");
  header.toggleClass("menuExtend");
  districtMenu.removeClass("district--show");
  iconArrow.removeClass("icon-arrow--open");
  header.removeClass("sonMenuExtend");
}

//navbar的下拉選單
let dropDownBtn = $(".DPList");
let districtMenu = $(".district");
let iconArrow = $(".icon-arrow");
function showDistrictMenu(e) {
  e.preventDefault();
  let node = e.target.nodeName;
  if (node == "A" || node == "IMG") {
    districtMenu.toggleClass("district--show");
    iconArrow.toggleClass("icon-arrow--open");
    header.toggleClass("sonMenuExtend");
  } else {
    return;
  }
} //開關下拉式選單

//點擊空白處關閉選單
let closeDistrictMenu = (e) => {
  if (e.target.id == "district-sel") return;
  hamburgerGB.removeClass("BGtoggle");
  districtMenu.removeClass("district--show");
  iconArrow.removeClass("icon-arrow--open");
  header.removeClass("sonMenuExtend");
  hamburgerIcon.removeClass("active");
  header.removeClass("menuExtend");
};

//渲染店家卡片內容
const cardBox = $(".cardBox");
const starRatingContainer = $(".RTcontainer");
function printCard(data) {
  if (data.length === 0) {
    cardBox.html("<h1>沒有資料QQ</h1>");
    return;
  }
  let len = data.length;
  let cardContent = "";
  for (let i = 0; i < len; i++) {
    cardContent += `<a href=" ${data[i].link}" class="card"><div class="card_pic"><img src="https://fakeimg.pl/300x200/200" ></div><div class="card_info"><h3 class="title">${data[i].name}</h3><div class="address">地址: <span>${data[i].address}</span></div><div class="rate"><div class="star_container"><span class="empty star"></span><span class="empty star"></span><span class="empty star"></span><span class="empty star"></span><span class="empty star"></span><span class="score">${data[i].rate}</span></div><div class="star_container RTcontainer">`;
    cardContent += renderStars(data, i);
    cardContent += `</div></div></div></a>`;
  }
  cardBox.html(cardContent);
}
//依照各家評分渲染星星數
function renderStars(data, storeNo) {
  let starRatingContainer = "";
  let score = Math.round(data[storeNo].rate);
  for (let i = 0; i < score; i++) {
    starRatingContainer += `<span class="star"></span>`;
  }
  return starRatingContainer;
}

//點擊下拉選單的選項更換相對應區域的店家
let BoxListTitle = $(".boxList_headline");
function switchDistrict(e) {
  let selDistrict = e.target.id;
  // console.log(selDistrict);
  if (selDistrict == "district-sel") return;
  let TownDistrict = ramenData.filter(function (item) {
    return item.district == selDistrict;
  });
  let MtDistrict = ramenData.filter(function (item) {
    return (
      item.district == "豐原區" ||
      item.district == "潭子區" ||
      item.district == "大雅區" ||
      item.district == "神岡區" ||
      item.district == "后里區" ||
      item.district == "東勢區" ||
      item.district == "石岡區" ||
      item.district == "新社區" ||
      item.district == "和平區"
    );
  });
  let SeaDistrict = ramenData.filter(function (item) {
    return (
      item.district == "大甲區" ||
      item.district == "清水區" ||
      item.district == "沙鹿區" ||
      item.district == "梧棲區" ||
      item.district == "大安區" ||
      item.district == "外埔區" ||
      item.district == "龍井區" ||
      item.district == "大肚區"
    );
  });
  let TunDistrict = ramenData.filter(function (item) {
    return (
      item.district == "大里區" ||
      item.district == "太平區" ||
      item.district == "霧峰區" ||
      item.district == "烏日區"
    );
  });
  switch (selDistrict) {
    case "中區":
    case "東區":
    case "西區":
    case "南區":
    case "北區":
    case "西屯區":
    case "南屯區":
    case "北屯區":
      // console.log(TownDistrict);
      printCard(TownDistrict);
      BoxListTitle.text(selDistrict + "店家");
      break;
    case "山線": {
      // console.log(MtDistrict);
      printCard(MtDistrict);
      BoxListTitle.text(selDistrict + "店家");
      break;
    }
    case "海線": {
      // console.log(SeaDistrict);
      printCard(SeaDistrict);
      BoxListTitle.text(selDistrict + "店家");
      break;
    }
    case "屯區": {
      // console.log(TunDistrict);
      printCard(TunDistrict);
      BoxListTitle.text(selDistrict + "店家");
      break;
    }
  }
  window.scrollTo(0, 300);
}

//搜尋功能
let searchInput = $(".searchInput");
function SearchAction(e) {
  const KEYCODE_ENTER = 13;
  if (e.which != KEYCODE_ENTER) return;
  let keywords = searchInput.val().trim();

  if (keywords == "") {
    alert("請輸入關鍵字!!");
    return;
  }
  searchInput.val("");
  searchInput.blur();
  window.scrollTo(0, 300);
  let result = ramenData.filter(function (item) {
    const nameMatch = item.name.match(keywords);
    const addressMatch = item.address.match(keywords);
    return nameMatch || addressMatch;
  });
  // console.log(result);
  BoxListTitle.text("包含" + keywords + "的店家");
  printCard(result);
}
