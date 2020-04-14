/**
 ** by zhouxiaoben.info
 **/
let dragbox = (function () {
  //默认配置
  let defaultOption = {
    dragbox: {
      width: '400px',
      fontSize: '14px',
      backgroundColor: '#87cefa',
    },
    draglist: {
      listSize: 4, //每行标签个数
      height: '40px', //每个标签高度
      data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7'], //标签数据
      backgroundColor: ['#00ae9d', '#11264f', '#2570a1'],
      margin: '1%',
    },
  }
  return {
    init: function (element) {
      let oj = new Object()
      oj.el = element
      oj.option = defaultOption
      initDragBox(oj.el, oj.option)
      oj.setOption = function (opt) {
        let optTemp = JSON.parse(JSON.stringify(defaultOption))
        if (typeof opt != 'underfined') {
          MergeRecursive(optTemp, opt)
        }
        oj.option = optTemp
        initDragBox(oj.el, oj.option)
      }
      oj.getCurrentData = function () {
        let data = []
        $(element).children('ul').children('li').each(function () {
          data.push($(this).text())
        })
        return data
      }
      oj.bindFunction = function () {
        initDragBox(oj.el, oj.option, arguments)
      }
      return oj
    },
  }
  //合并两个多层级对象
  function MergeRecursive(obj1, obj2) {
    for (var p in obj2) {
      if (obj2[p].constructor == Object) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p])
      } else {
        obj1[p] = obj2[p]
      }
    }

    return obj1
  }
  //创建拖拽元素
  function buildElement(element, option) {
    if (typeof element == 'underfined') {
      console.log('拖拽组件初始化失败')
      return
    }
    $(element).addClass('drag-box')
    $(element).html('')
    $(element).append('<ul></ul>')
    for (let val of option.draglist.data) {
      $(element)
        .children('ul')
        .append('<li>' + val + '</li>')
    }
    $(element).css('width', option.dragbox.width)
    $(element).css('font-size', option.dragbox.fontSize)
    $(element).css('background-color', option.dragbox.backgroundColor)

    let draglistBgMargin = parseFloat(option.draglist.margin.replace('%', ''))
    let width =
      (100 - parseInt(option.draglist.listSize) * 2 * draglistBgMargin) /
        parseInt(option.draglist.listSize) +
      '%'

    let dragLists = $(element).children('ul').children('li')
    let draglistBgLength = option.draglist.backgroundColor.length
    dragLists.css({
      height: option.draglist.height,
      'line-height': option.draglist.height,
      width: width,
      margin: option.draglist.margin,
    })

    if (draglistBgLength == 1) {
      dragLists.css({
        'background-color': option.draglist.backgroundColor[0],
      })
    } else if (draglistBgLength > 1) {
      let num = 0
      for (let i = 0; i < dragLists.length; i++) {
        $(dragLists[i]).css(
          'background-color',
          option.draglist.backgroundColor[num]
        )
        num++
        num = num > draglistBgLength - 1 ? 0 : num
      }
    }
  }

  function updateNewDragList(element, option) {
    let draglistBgMargin = parseFloat(option.draglist.margin.replace('%', ''))
    let dragListWidth =
      (100 - parseInt(option.draglist.listSize) * 2 * draglistBgMargin) /
        parseInt(option.draglist.listSize) +
      '%'
    $(element).children('ul').children('.drag-new-tag').css({
      height: option.draglist.height,
      'line-height': option.draglist.height,
      width: dragListWidth,
      margin: option.draglist.margin,
    })
  }

  //初始化拖拽元素
  function initDragBox(element, option, bfunctions) {
    buildElement(element, option)

    let dragLi = $(element).children('ul').children('li')
    let isDown = false
    let pwidth = $(element).width()
    let pheight = $(element).height()
    let newTag = "<li class='drag-new-tag'></li>"

    //鼠标按下事件
    dragLi.off('mousedown').on('mousedown', function (e) {
      let dx = $(element).offset().left
      let dy = $(element).offset().top - $(document).scrollTop()
      isDown = true
      let target = e.target

      $(target).after(newTag)
      updateNewDragList(element, option)
      //获取每行能放多少个元素
      $(target).css('position', 'absolute')
      //当前元素高度和宽度
      let width =
        $(target).outerWidth() +
        parseInt($(target).css('margin').replace('px', '')) * 2
      let height =
        $(target).outerHeight() +
        parseInt($(target).css('margin').replace('px', '')) * 2
      //每行可以容纳的元素个数
      let n = parseInt($(target).parent('ul').width() / width)
      $(target).attr('id', 'moveLi')

      $(target).css('top', e.clientY - dy - height / 2 + 'px')
      $(target).css('left', e.clientX - dx - width / 2 + 'px')
      //鼠标移动事件
      $(document)
        .off('mousemove')
        .on('mousemove', function (e) {
          if (isDown == false) {
            return
          }
          //鼠标在dragBox上的相对位置
          let clientX = e.clientX - dx
          let clientY = e.clientY - dy
          //计算移到第几个元素
          if (
            clientX > 0 &&
            clientY > 0 &&
            clientX < pwidth &&
            clientY < pheight
          ) {
            let nw = parseInt(clientX / width) + 1
            let nh = parseInt(clientY / height)
            if (n <= nw) {
              nw = n
            }
            //第几个元素
            let n_real = nh * n + nw
            if (n_real <= dragLi.length) {
              let dragLi1 = $(element).children('ul').children("[id!='moveLi']")
              //放置空格下标
              let new_tag = -1
              for (let i = 0; i < dragLi1.length; i++) {
                if ($(dragLi1[i]).hasClass('drag-new-tag')) {
                  new_tag = i
                }
              }
              if (n_real - 1 != new_tag) {
                $(element).children('ul').children('.drag-new-tag').remove()
                if (n_real - 1 < new_tag) {
                  $(dragLi1[n_real - 1]).before(newTag)
                  updateNewDragList(element, option)
                } else {
                  $(dragLi1[n_real - 1]).after(newTag)
                  updateNewDragList(element, option)
                }
              }
            }
          }
          let moveLeft = clientX - width / 2
          let moveTop = clientY - height / 2
          $(target).css('left', moveLeft + 'px')
          $(target).css('top', moveTop + 'px')
        })

      //松开鼠标事件
      $(document)
        .off('mouseup')
        .on('mouseup', function (e) {
          let clientX = e.clientX - dx
          let clientY = e.clientY - dy
          //计算移到第几个元素
          let nw = parseInt(clientX / width) + 1
          let nh = parseInt(clientY / height)
          if (n <= nw) {
            nw = n
          }
          //第几个元素
          let n_real = nh * n + nw
          let dragLi1 = $(element).children('ul').children("[id!='moveLi']")
          //放置空格下标
          let new_tag = -1
          for (let i = 0; i < dragLi1.length; i++) {
            if ($(dragLi1[i]).hasClass('drag-new-tag')) {
              new_tag = i
            }
          }
          if (n_real - 1 == new_tag) {
            $(target).siblings('.drag-new-tag').after($(target))
            $(target).css('position', '')
            $(target).css('left', '')
            $(target).css('top', '')
            $(target).attr('id', '')
          } else {
            $(target).css('position', '')
            $(target).css('left', '')
            $(target).css('top', '')
            $(target).attr('id', '')
          }
          $(target).siblings('.drag-new-tag').remove()

          if (typeof bfunctions != 'undefined') {
            for (let val of bfunctions) {
              if (typeof val != 'undefined' && typeof val == 'function') {
                val()
              }
            }
            if (
              typeof bfunctions != 'undefined' &&
              typeof bfunctions == 'function'
            ) {
              bfunction()
            }
          }

          isDown = false
        })
    })
  }
})()
