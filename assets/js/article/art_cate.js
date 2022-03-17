$(function() {
    let layer = layui.layer;
    let form = layui.form;
    initArtCateList();

    // 文章类别页面初始化
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                let htmlStr = template('tql-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    // 为添加类别绑定事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

    });

    // 监听注册表单提交事件
    // 这里要通过代理的方式绑定 因为这里form-add还没有生成
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                initArtCateList();
                //根据索引关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })

    // 通过代理的方式,为编辑绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        let id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })
    })

    // 监听修改表单提交事件
    // 通过代理的方式绑定 因为这里form-add还没有生成
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 修改成功后更新列表
                initArtCateList();
                layer.msg(res.message);
                //根据索引关闭对应的弹出层
                layer.close(indexEdit);
            }
        })
    })

    //通过代理的方式,为删除绑定点击事件
    $('tbody').on('click', '#btn-del', function() {
        let id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    // 删除成功后更新列表
                    initArtCateList();
                    layer.msg(res.message);

                }
            })
            layer.close(index);
        });
    })
})