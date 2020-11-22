var train_data = {
    name: "",
    file: null,
    age:null,
    father_name:"",
    mobile:null,
    submission_by:""
};

var recognize_data = {
    file: null,
    mobile:0000,
    location:"default_loc",
    submission_by:"default_name"
};


var message = null;
var active_section = null;

function render(){

   // clear form data

   $('.form-item input').val('');
   $('.tabs li').removeClass('active');
   $('.tabs li:first').addClass('active');


   active_section = 'train-content';

    $('#'+active_section).show();


}
function update(){


    if(message){
        // render message

        $('.message').html('<p class="'+_.get(message, 'type')+'">'+_.get(message, 'message')+'</p>');
    }else{
        $('.message').html('');
    }

    $('#train-content, #recognize-content').hide();
    $('#'+active_section).show();



}


$(document).ready(function(){




    // listen for file added

    $('#train #input-file').on('change', function(event){



        //set file object to train_data
        train_data.file = _.get(event, 'target.files[0]', null);


    });


    // listen for name change
    $('#name-field').on('change', function(event){

        train_data.name = _.get(event, 'target.value', '');

    });

    $('#age-field').on('change', function(event){

        train_data.age = _.get(event, 'target.value', '');

    });

    $('#father-name-field').on('change', function(event){

        train_data.father_name = _.get(event, 'target.value', '');

    });

    $('#mobile-field').on('change', function(event){

        train_data.mobile = _.get(event, 'target.value', '');

    });

    $('#submission-by-field').on('change', function(event){

        train_data.submission_by = _.get(event, 'target.value', '');

    });

    // listen tab item click on

    $('.tabs li').on('click', function(e){

        var $this = $(this);


        active_section = $this.data('section');

        // remove all active class

        $('.tabs li').removeClass('active');

        $this.addClass('active');

        message = null;

        update();



    });


    // listen the form train submit

    $('#train').submit(function(event){

        message = null;

        if(train_data.name && train_data.file){
            // do send data to backend api

            var train_form_data = new FormData();

            train_form_data.append('name', train_data.name);
            train_form_data.append('file', train_data.file);
            train_form_data.append('age',train_data.age);
            train_form_data.append('father_name',train_data.father_name);
            train_form_data.append('mobile', train_data.mobile);
            train_form_data.append('submission_by',train_data.submission_by);

            axios.post('/api/train', train_form_data).then(function(response){

                console.log(response.data);
                message = {type: 'success', message: `Training of image of ${response.data.name} with id ${response.data.user_id} is done!`};

                train_data = {name: '', file: null};
                update();

            }).catch(function(error){


                  message = {type: 'error', message: _.get(error, 'response.data.error.message', 'Unknown error.')}

                  update();
            });

        }else{

            message = {type: "error", message: "Name and face image is required."}



        }

        update();
        event.preventDefault();
    });


    // listen for recognize file field change
    $('#recognize-input-file').on('change', function(e){


        recognize_data.file = _.get(e, 'target.files[0]', null);

    });


    $('#recognize-location-field').on('change', function(event){

        recognize_data.location = _.get(event, 'target.value', '');

    });

    $('#recognize-mobile-field').on('change', function(event){

        recognize_data.mobile = _.get(event, 'target.value', '');

    });

    $('#recognize-submission-field').on('change', function(event){

        recognize_data.submission_by = _.get(event, 'target.value', '');

    });



    // listen for recognition form submit
    $('#recognize').submit(function(e){



        // call to backend
        var recog_form_data = new FormData();
        recog_form_data.append('file', recognize_data.file);
        recog_form_data.append('mobile', recognize_data.mobile);
        recog_form_data.append('submission_by',recognize_data.submission_by);
        recog_form_data.append('location', recognize_data.location);

        axios.post('/api/recognize', recog_form_data).then(function(response){


            console.log("We found a user matched with your face image is", response.data);

            message = {type: 'success', message: 'We found a user matched with your face image is: '+ response.data.user.name};

            recognize_data = {file: null};
            update();

        }).catch(function(err){


            message = {type: 'error', message: _.get(err, 'response.data.error.message', 'Unknown error')};

            update();

        });
        e.preventDefault();
    });




// render the app;
render();

});



