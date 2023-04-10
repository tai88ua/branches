

$(document).ready(function () {
    const root = $("#root");
    root.on('click', '.caret', showBranch);

    /**
     *
     */
    function showBranch() {
        if (!$(this).hasClass("caret-down")) {
            const key = $(this).parent().data('id');
            const el = $(this).parent().find(".nested");

            if (el.find('li').length == 0) {
                showElements(key, el);
            }
        }
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
    }

    /**
     *
     * @param {number} parentId int
     * @param {object} el
     */
    function showElements(parentId, el) {
        $.ajax({
            dataType: 'json',
            url: '/api/get',
            data: {parent_id: parentId},
            success: function (data) {
                console.log(data.items);
                if (data.items.length > 0) {
                    data.items.forEach(function (element) {
                        const li = $("<li></li>").attr("data-id", element.id);
                        const nameSpan = $("<span></span>").text(element.name).addClass("name")
                            .attr("data-toggle", "modal")
                            .attr("data-target", "#updateModal")
                            .attr("data-brunch-id", element.id)
                            .attr("data-brunch-name", element.name);
                        const addButton = $("<button></button>").text('+')
                            .addClass("add btn btn-primary")
                            .attr("data-toggle", "modal")
                            .attr("data-target", "#addModal")
                            .attr("data-whatever", element.id)
                        ;


                        const removeButton = $("<button></button>").text('-')
                            .addClass("remove btn btn-danger")
                            .attr("data-toggle", "modal")
                            .attr("data-target", "#deleteModal")
                            .attr("data-whatever", element.id);
                        const tmpKey = 'data' + element.id
                        if (element.hasChild) {
                            const span = $("<span></span>").addClass('caret');
                            const ul = $("<ul></ul>").addClass('nested');
                            li.append(span);
                            li.append(nameSpan);
                            li.append(addButton);
                            li.append(removeButton);
                            li.append(ul);
                        } else {
                            li.append(nameSpan);
                            li.append(addButton);
                            li.append(removeButton);
                        }

                        el.append(li);
                    });
                }

                if ($("#root li").length > 0) {
                    $('#add-root-button').hide();
                }
            }
        });
    }

    showElements(0, $('#root'));

    $('#add-brunch').click(function () {
        const name = $('#brunch-name').val();
        const id = $('#parent-id').val(); //parent id
        if (name.length == 0) {return;}

        const element = $('[data-id="' + id + '"]'); //element parent id
        let ulContainer = element.parent();
        let parentId = element.parent().parent().data('id'); //parent for parent need for update

        if (parentId === undefined) {
            parentId = 0;
            ulContainer = $("#root");
        }

        console.log('parentID  : ' + parentId);
        $.ajax({
            dataType: 'json',
            url: '/api/add',
            data: {name: name, parent_id: id},
            type: "POST",
            success: function (data) {
                console.log(data);
            }
        });

        ulContainer.html('');
        showElements(parentId, ulContainer);

        $('#addModal').modal('toggle');

        if ($("#root li").length > 0) {
            $('#add-root-button').hide();
        }
    });

    $('#update-brunch').click(function () {
        const name = $('#update-brunch-name').val();
        const id = $('#brunch-id').val();

        if (name.length == 0) {return;}

        const element = $('[data-id="' + id + '"]');
        let ulContainer = element.parent();
        let parentId = element.parent().parent().data('id'); //parent for parent need for update

        if (parentId === undefined) {
            parentId = 0;
            ulContainer = $("#root");
        }

        console.log('parentID  : ' + parentId);

        $.ajax({
            dataType: 'json',
            url: '/api/update',
            data: {name: name, id: id},
            type: "POST",
            success: function (data) {
                console.log(data);
            }
        });

        ulContainer.html('');

        showElements(parentId, ulContainer);
        $('#updateModal').modal('toggle');
    });


    $('#delete-brunch').click(function () {

        const id = $('#parent-id-delete').val();
        const element = $('[data-id="' + id + '"]');
        let ulContainer = element.parent();
        let parentId = element.parent().parent().data('id');

        if (parentId === undefined) {
            parentId = 0;
            ulContainer = $("#root");
        }

        $.ajax({
            dataType: 'json',
            url: '/api/delete',
            data: {id: id},
            type: "POST",
            success: function (data) {
                console.log(data);
            }
        });

        ulContainer.html('');

        showElements(parentId, ulContainer);
        $('#deleteModal').modal('toggle');

        if ($("#root li").length == 0) {
            $('#add-root-button').show();
        }
    })

    $('#addModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget)
        const recipient = button.data('whatever')
        const modal = $(this)
        modal.find('#parent-id').val(recipient);
        $('#brunch-name').val('');
    });

    $('#updateModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const id = button.data('brunch-id');
        const name = button.data('brunch-name');
        const modal = $(this)
        modal.find('#brunch-id').val(id);
        modal.find('#update-brunch-name').val(name);
    });

    $('#deleteModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget) // Button that triggered the modal
        const recipient = button.data('whatever') // Extract info from data-* attributes
        $(this).find('#parent-id-delete').val(recipient);

        var tim = function () {
            setTimeout(function () {
                let t = 20;
                $('#deleteModal .timer').text(t);
                let int = setInterval(function () {
                    t--;
                    if (t == -1) {
                        clearInterval(int);
                        if ($('#deleteModal').hasClass('show')) { //check modal is show
                            $('#deleteModal').modal('toggle');
                        }
                    } else {
                        if (!$('#deleteModal').hasClass('show')) {
                            clearInterval(int);
                        }
                        $('#deleteModal .timer').text(t);
                    }
                }, 1000);
            }, 1)
        };
        tim();
    });
});
