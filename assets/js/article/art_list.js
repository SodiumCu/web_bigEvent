$(function() {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;
    // 定义美化事件的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : `0${n}`;
    }

    // 定义一个查询的参数对象,将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值,默认请求第一页数据
        pagesize: 2, // 每页显示几条数据,默认每页显示2条
        cate_id: '', // 文章分类的Id
        state: '', // 文章的发布状态
    }

    initTable();
    initCate();

    // 初始化文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-list', res);
                $('tbody').html(htmlStr);

                // 渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    // 获取文章分类列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过layui重新渲染表单区域的UI结构 由于在模板引擎渲染前 layui就已经把原本html里的表单渲染过了 当时是只有空表单 因此 在我们把数据获取到之后,应当要再重新提醒layui 可以重新渲染了
                form.render();
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        let cate_id = $('[name=cate_id').val();
        let state = $('[name=state').val();
        q.cate_id = cate_id;
        q.state = state;
        // 更新表单
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时,触发 jump 回调
            // 触发jump回调的方式有两种:
            // 1.点击页码的时候,会触发jump回调
            // 2.只要调用了 laypage.render() 方法,就会触发 jump 回调
            jump: function(obj, first) {
                // 可以通过first的值,来判断是通过哪种方式,触发的jump回调
                // 如果first的值为true,证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first);
                // 把最新的页码值,赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数,赋值到 q 这个查询参数对象中
                q.pagesize = obj.limit; //本质上切换条目数的时候 也会触发jump回调
                // 根据最新的q获取对应的数据列表,并渲染表格
                // initTable(); 不能直接调用 会进入死循环 initTable调用laypage.render laypage.render调用initTable
                if (!first) {
                    initTable();
                }
            }
        })
    }

    // 通过代理的方式,为删除按钮绑定删除事件
    $('tbody').on('click', '#btn-del', function() {
        // 获取当前页面所有删除按钮的个数
        let len = $('#btn-del').length;
        let id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    // 成功删除后更新表格
                    // 小bug:
                    // 当数据删除完成后,需要判断这一页中,是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,再重新调用initTable方法
                    // 当点击删除键会获得当前拥有的删除按钮个数 当它为1时,此时删除后会变为0,故此时要页码值-1
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();

                }
            })
            layer.close(index);
        });
    });

    // 通过代理的方式，为编辑按钮添加点击事件
    $('tbody').on('click', '#btn-edit', function() {
        let id = $(this).attr('data-id');
        localStorage.setItem('id', id);
        location.href = '../article/art_edit.html';
    })
})