import DEFAULT from "./default.js";
import { assign } from "./lib.js";

class ActivityTimeline {
  /**
   * ActivityTimeline 建構子
   * @param {Element} element - 指定渲染的DOM
   * @param {Object} [options={}] - 覆寫的選項參數
   */
  constructor(element, options = {}) {
    this.$element = element;
    // 繼承外部客製選項
    this.options = Object.freeze($.extend(true, {}, DEFAULT, options));
    // 儲存當下的資料
    this.saveData = [];
    // 初始化
    this.init(this.options);
  }
  /**
   * 初始化 ActivityTimeline 實例
   * @param {Object} [options={}] - 變更的選項參數
   */
  init(options = {}) {
    this.options = options;
    this.saveData = options.data;
    this.refetchTable(options.data)
    this.bind(options);
  }
  // 更新 ActivityTimeline 實例
    updateOptions(updateOpt = {}) {
      this.init(updateOpt);
    }
  /**
   * 重新渲染 Table
   * @param {Array} [data={}] - 欄位資料
   * @param {Number} [origPerItem={}] - 顯示筆數
   */
  refetchTable(data = [], origPerItem) {
    const { $element, options } = this;

    $element.empty();
    if (options.showInfo) $element.empty();

    // 預設卡片顯示數的陣列
    let newData = data.slice(0, -(data.length - options.perItem));

    if (origPerItem !== options.data.length && data.length > options.perItem) {
      printCard(newData);
    } else {
      printCard(data);
    }
    /**
     * 渲染卡片內容
     * @param {Array} [data={}] - 欄位資料
     */
    function printCard(data) {
      $.each(data, function (key, item) {
        console.log(item)
        let row = $(`<div class="card">
       <div class="card_body" id="${item.id}"><span class="card_ball-show">${item.id}</span></div></div>`);
        row.append(
          $(
            `<div class="card-title py-2"><h5 class="mx-3 text-white">${item.title}</h5></div>`
          )
        );
        row.append(
          $(
            `<ul class="card-text pl-3 pr-3">
            <li  class="font-weight-bold cardName">${item.name}</li>
            <li class="cardEmail">${item.email}</li>
            <hr class="mt-1 mb-0 card__hr">
            <li class="cardContent">${item.bref}</li>
            <li  class="my-3 cardFooter">
              <span data-id="${item.id}">
              <a href="#" class="edit-btn btn">Edit</a>
              <a href="#" class="delete-btn btn">X</a>
              </span>
              <span class="cardDate">${item.datetime}</span></li>
          </ul>`
          )
        );
        $element.append(row);
      });
    }
  }

  /**
   * 綁定事件
   * @param {Object} [options={}] - 變更的選項參數
   */
  bind(options = {}) {
    // 綁訂edit按鈕

    $(".edit-btn").on("click", function (e) {
      // _id是修改按鈕的父元素的id
      const _id = $(this).parent().data("id");
      let result = $.grep(options.data, function (e) {
        return e.id == _id;
      });
      let rowData = {};
      rowData = {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        title: result[0].title,
        bref: result[0].bref,
        datetime: result[0].datetime,
      };

      if ($.isFunction(options.onEdit)) {
        options.onEdit(rowData);
        rowData = "";
      }
    });
    // 綁訂delete按鈕
    $(".delete-btn").on("click", function () {
      const _id = $(this).parent().data("id");

      if ($.isFunction(options.onDelete)) {
        options.onDelete(_id);
      }
    });
  }

/*
 * 動態設置 ActivityTimeline 選項參數
 * @param {Object} [options] - 更新預設參數
 */
setOptions(setOpt = {}) {
    let { options } = this;
  const currentOptions = assign(
  {},
  options,
  $.isPlainObject(setOpt) && setOpt
  );
  this.updateOptions(currentOptions);
  }
/*
 * 新增資料
 * @param {Object} [data] - 回傳的新增資料
 */
addData(data = {}) {
    const { options } = this;
      // 新值加入data
      options.data.push(data);
      // 加入新值後重新渲染畫面
      this.bind(options);
      this.refetchTable(options.data);
  
      // 送出後欄位清空
      $("#activityTitle,#name,#email,#activityContent").val("");
  }
/*
 * 更新單筆資料
 * @param {Object} [data] - 回傳的更新資料
 */
updateData(data = {}) {
    // 找到原陣列裡面 id符合回傳資料id的第一筆資料，parseInt字串轉數字
    const _index = this.options.data.findIndex(
      (item) => parseInt(item.id) === parseInt(data.id)
    );

    // 撈savaData找到的那筆資料把內容換成data
    this.options.data[_index].name = data.name;
    this.options.data[_index].email = data.email;
    this.options.data[_index].title = data.title;
    this.options.data[_index].bref = data.bref;
    this.options.data[_index].datetime = data.datetime;

    // 更新資料
    this.refetchTable(this.options.data);
    this.bind(this.options);
  }
/*
 * 刪除單筆資料
 * @param {Number} [id] - 資料序號
 */
removeDataByID(id) {
    let { options, saveData } = this;
    options.data.forEach(function (obj, i) {
      if (true && parseInt(obj.id) === parseInt(id)) {
        options.data.splice(i, 1);
      }
    });
    $("#DataTable_filter > label >input").val("");
    this.refetchTable(saveData);
    this.bind(options);
  }

/*
 * 排序資料
 * @param {String} [type] - (asc|desc)
 * asc: 小至大
 * desc: 大至小
 */
sort(type) {
  if (type == "asc") {
    this.saveData.sort(function (a, b) {
      return parseFloat(a.id) - parseFloat(b.id);
    });
    this.refetchTable(this.saveData);
    this.bind(this.options);
  } else {
    this.saveData.sort(function (a, b) {
      return parseFloat(a.id) - parseFloat(b.id);
    });
    const reverseData = this.saveData.reverse();
    this.refetchTable(reverseData);
    this.bind(this.options);
  }
}
}
export default ActivityTimeline;
