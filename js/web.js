class Web{

    onLoad(){
        cr.get_json("config.json",(config_data)=>{
            cr.site_url=config_data.site_url;
            cr_firestore.id_project = config_data.id_project;
            cr_firestore.api_key = config_data.api_key;
            w.show_home();
        });
    }

    show_home(){
        $("#all-item-styles").html("");
        cr_firestore.list("style",data=>{
            $.each(data,function(index,style){
                $("#all-item-styles").append(w.item_style_box(style));
            });
        });
    }

    item_style_box(data){
        var html=$(`
            <div class="col">
                <div class="card book-card h-100">
                    <img src="${data.txt0}" class="card-img-top w-100" alt="Book 1">
                    <div class="card-body">
                        <h5 class="card-title">${data.name}</h5>
                        <p class="card-text">${data.tip}</p>
                    </div>
                </div>
            </div>
        `);
        return html;
    }
}

var w=new Web();

$(document).ready(function() {
    w.onLoad();
});