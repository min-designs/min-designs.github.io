const lazyImgs = [];
const menuEles = [];
// const serverHost = "https://47.103.27.218:8989/";
const serverHost = "https://www.shiqijituan.com:8989/";
history.scrollRestoration = "manual";

// 解决切换页面时，动画有残影
$(".lazy-load").css({transition: 'opacity .6s linear,transform .6s cubic-bezier(0.26,0.67,0.48,0.91)'})
lazyImgs.push(...$(".lazy-load"));

function lazyLoad(e) {
  let count = 0;
  for (let i = 0; i < lazyImgs.length; i++) {
    const img = lazyImgs[i];
    if (isVisible(img, e) && !img.dataset.loaded) {
      img.dataset.loaded = true;
      (function (count) {
        setTimeout(() => {
          $(img).css({opacity: 1, transform: "translateY(0)"});
        }, count * 80);
      })(count);
      count++;
    }
  }
}
// 3 可视区域判断函数
function isVisible(img, e) {
  // 判断是否在可视区域
  const imgRect = img.getBoundingClientRect();
  return imgRect.top - (e ? 0 : 100) < window.innerHeight;
}

function formatTxt(txt){
  txt = txt.replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank">$1</a>');
  return txt.replace(/\n/g, '<br>');
}

$(function () {
  const domain = window.location.hostname;
  if(domain.includes('shiqijituan')){
    $('#beian-number').html('-1');
  }
  if(domain.includes('shiqi.top')){
    $('#beian-number').html('-2');
  }
  // 页面菜单
  menuEles.push(...document.querySelectorAll(".page-header-content, .page-header-decorate-1, .page-header-decorate-2"));
  function loadMenu() {
    for (let i = 0; i < menuEles.length; i++) {
      (function (i) {
        setTimeout(() => {
          $(menuEles[i]).css({ opacity: 1,
            transform: "translateY(0)",
            transition: "all 1s cubic-bezier(0.215, 0.61, 0.355, 1)"
          });
        }, i * 80);
      })(i);
    }
  }
  window.loadMenu = loadMenu;
  if (window.location.pathname !== "/") {
    setTimeout(() => {
      loadMenu();
    }, 800);
  }
  function checkPageHeader() {
    if ($(window).scrollTop() < 20) {
      $(".page-header").removeClass("page-header-scroll");
    } else {
      $(".page-header").addClass("page-header-scroll");
    }
  }
  checkPageHeader();
  $(window).on("scroll", () => {
    checkPageHeader();
    // if ($(".scroll-circle").length > 0) {
    //   const d = 160 - ($(window).scrollTop() - $(".scroll-circle").offset().top + $(window).height()) / 4.4;
    //   $(".scroll-circle").css("transform", "translateY(0px) rotate(" + d + "deg)");
    // }
    // $(".page-decorate-5, .courses-page-decorate-1 img").css(
    //   "transform",
    //   "rotate(" + $(window).scrollTop() / 5 + "deg)"
    // );
  });

  let startX, startY;
  $(".portfolio-grid").on("click", ".grid-item-content", function (e) {
    getDetail(e, this);
  });

  $(".biz-direction, .brand-direction").on("click", "li > a", function (e) {
    getDetail(e, this);
  });

  $(".courses-intro-video").on("click", "a", function (e) {
    getDetail(e, this);
  });

  $(".more-btn").on("click", ".more-btn-search", function (e) {
    getDetail(e, this, 'search');
  });

  function getDetail(e, t, type) {
    document.querySelector("body").classList.add("no-scroll");

    // 计算中心位置
    var centerX = $(window).width() / 2;
    var centerY = $(window).height() / 2;
    startX = e.clientX - centerX;
    startY = e.clientY - centerY;

    if(type==='search'){
      $("#search-member").css({ top: 0 });
    }else{
      $("#base-dialog").css({ top: 0 });
    }
    
    $(".dialog-bg").css({ opacity: 1 });
    $(".dialog-content").css({
      transition: "none",
      transform: "translate(0, 100vh) scale(1)",
    });
    setTimeout(() => {
      $(".dialog-content").css({
        transform: "translate(0,0) scale(1)",
        opacity: 1,
        transition: "all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)",
      });
    }, 300);

    if ($(t).data("id")) {
      const path = e.currentTarget.className.indexOf('grid-item') === 0
          ? "imageAndVideo/selectImageAndVideoDetailByById"
          : "image/selectImageDetailById";
      $.ajax({
        url: serverHost + path,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
          id: $(t).data("id"),
        }),
        success: function (data) {
          if (data.code === 200) {
            const founderData = data.data.list;
            founderData.sort((a, b) => a.sort - b.sort);
            let htmlStr = "";
            for (let i = 0; i < founderData.length; i++) {
              const fileUrl = founderData[i].url;
              const fileType = fileUrl.substring(fileUrl.lastIndexOf(".")).toLowerCase();
              if (/(.*)\.(mp4|avi|wmv)$/.test(fileType)) {
                htmlStr +=
                  `<video preload="auto" playsinline="" data-autoplay-desktop="true" data-autoplay-portrait="true"
                data-autoplay-mobile="true" data-play-on-hover="false" controls="" loop="" data-object-fit="true"
                src="` +
                  fileUrl +
                  `" data-loaded="true" autoplay="" width="100%" height="100%"></video>`;
                  $(".dialog-body-scroll").addClass('dialog-video-scroll')
              } else {
                htmlStr += `<img src="` + fileUrl + `">`;
                $(".dialog-body-scroll").removeClass('dialog-video-scroll');
              }
            }
            // 添加头部信息
            const avatar = $(t).data("authorimage") || "./img/icon-avatar.png";
            $(".dialog-header-info").html(`<img src="` + avatar + `" width="64" height="64" /><h3>` + $(t).data("title") + `</h3>
                                           <p>` + $(t).data("author") + `</p>` );
            // 填充内容，计算图片宽度，整体居中
            $(".dialog-body-scroll").html(htmlStr);
            let w = 1280;
            const $img = $(".dialog-body-scroll img");
            $(".dialog-content").css({ width: w + 15 + "px" });
            $img.css({ width: w + "px" });
            if(founderData.length===1){
              $(".dialog-body-scroll").imagesLoaded(()=>{
                const oldH = $img.height();
                const newH = $(window).height() - 144
                if(oldH > newH){
                  w = newH / oldH * $img.width();
                  $(".dialog-content").css({ width: w + 15 + "px" });
                  $img.css({ width: w + "px" });
                }
              })
            }
          } else {
            console.error(data.message);
          }
        },
        error: function () { },
      });
    }
  }
  window.getDetail = getDetail;

  $(".dialog-close, .dialog-bg").on("click", function (e) {
    closeDialog();
  });

  $(document).on('keyup', function(e) {
      if (e.key === "Escape") closeDialog();
  });

  /* 鼠标下滚关闭窗口
  let oldScollTop = 0;
  $(document).on('mousewheel', function(e) {
    if($(".dialog-body-scroll img").length > 1){
      if(oldScollTop > 0 && $(".dialog-body")[0].scrollHeight === $(".dialog-body").scrollTop()+$(".dialog-body").height()){
        closeDialog();
      }
      oldScollTop = $(".dialog-body").scrollTop();
    }else{
      closeDialog();
    }
  });
  */

  function closeDialog() {
    $(".dialog-content").css({
      transform: "translate(0, 100vh) scale(1)",
      // opacity: 0,
    });

    setTimeout(() => {
      $(".dialog-bg").css({ opacity: 0 });
      // $(".page-bg-1, .page-bg-2, .page-header-content, body>img").css("filter", "none");
    }, 100);
    setTimeout(() => {
      $(".dialog-wrapper").css({ top: 100000 });
    }, 300);
    setTimeout(() => {
      $(".dialog-wrapper").css({ top: 100000 });
      document.querySelector("body").classList.remove("no-scroll");
    }, 500);

    if($('.dialog-courses video').length > 0) $('.dialog-courses video')[0].pause();

    $(".dialog-content:not(.dialog-courses) .dialog-body-scroll").html("");
  }
  const titleIconLogo = document.getElementById("title-icon-logo");
  if (titleIconLogo) {
    titleIconLogo.addEventListener("load",function(){
      var svgObject = titleIconLogo.getSVGDocument();
      var pathElement = svgObject.querySelector("path");
      pathElement.style.fill = "none";
      pathElement.style.stroke = "#FF7F00";
    })
  }
  // 文字过长跑马灯效果
  $(".portfolio-grid").on("mouseenter", ".grid-item", function (e) {
    const $p = $(this).find(".grid-item-desc-remarks p");
    let w = $p[0].scrollWidth;

    if(w > 220){
      const txt = $p.data("txt");
      $p.html(txt+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +txt);
      w = $p[0].scrollWidth
      const x = -w/2 - 18;
      $p.css({
        transform: "translateX(" + x + "px)",
        transition: "transform " + -x / 70 + "s linear .6s",
      });
    }
  })
  $(".portfolio-grid").on("mouseleave", ".grid-item", function (e) {
    const $p = $(this).find(".grid-item-desc-remarks p");
    const txt = $p.data("txt");
    $p.html(txt);
    $p.css({"transform": "translateX(0)", "transition": "transform .1s linear .2s"});
  })

  $('.search-bar').on('click', 'button', function () {
    onSearch();
  })

  $('.search-bar').on('keydown', 'input', function () {
    if (event.which === 13) { // 13是回车键的键码
      // 阻止默认行为，例如表单提交
      event.preventDefault();

      // 调用搜索按钮的点击事件
      $('.search-bar button').trigger('click');
    }
  })
});

function checkAfterAjax(){
  $('.courses-list-content h3').each((idx,item)=>{
    if($(item).text().trim().startsWith('【')){
      $(item).css('margin-left','7px');
    }
  })
}

function onSearch() {
  let keyword = $(".search-bar input").val().trim();
  if (keyword) {
    $(".no-result").hide();
    $(".no-student").hide();
    $(".result-list").hide().html(`<p>查询结果</p>`);
    $.ajax({
      url: serverHost + "appletIndex/selectStudentById",
      type: "POST",
      contentType: "application/json;charset=utf-8",
      dataType: "json",
      data: JSON.stringify({
        search: keyword,
      }),
      success: function (data) {
        const list = data.data.list;
        if (list.length > 0) {
          let count = 0;
          list.map((item) => {
            console.log(item.nickName);
            if (item.nickName == null) return;
            $(".result-list").append(`
              <div class="result-item">
                <div class="result-item-avatar">
                  <img src="${item.headImgUrl || "img/avatar-d.png"}" width="100" height="100" />
                </div>
                <div class="result-item-info">
                  <h3>${item.nickName}</h3>
                  <p>士气ID：<span>${item.id}</span></p>
                </div>
                <div class="result-item-footer">
                  <img src="img/authentication.svg" alt="">
                </div>
              </div>
            `);
            count++;
          });
          if (count > 0) {
            $(".result-list").show();
          } else {
            $(".no-student").show();
          }
        } else {
          $(".no-student").show();
        }
      },
    });
  }
}