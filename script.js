

$(document).ready(function() {
    // Fetch students data when the page loads
   

    $("#fetchStudents").on('click', function() {
        fetchStudents();
    });

    function fetchStudents() {
        $.ajax({
            url: '/students',
            method: 'GET',
            success: function(data) {
                $('#myTable tbody').html(data);
            },
            error: function(err) {
                console.error('Error fetching students:', err);
            }
        });
    }

    function addStudent(){
        
        var formData = {
            name : $('#name').val(),
            fname : $('#fname').val(),
            email : $('#email').val(),
            date : $('#date').val()

        };
        
        $.ajax({
            url: '/add-student',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                alert(response)
                fetchStudents();
                
            },
            error: function(xhr, status, error) {
                alert('Error adding data:', error);
            }
        });
       
    }

    // Handle form submission
    $("#addRowForm").on('submit', function(event) {
        event.preventDefault();  // Prevent the form from submitting the traditional way
        addStudent();
                
    });


      // Event delegation for dynamically generated Edit buttons
      let studentId;

      $(document).on('click', '.edit', function() {
          const row = $(this).closest('tr');
          studentId = row.find('td:first').text();  // Assign value to the global variable
          var cells = row.find('td');
      
          $('#submit').attr('class', 'hidden');
          $('#updateStudent').attr('class', 'nothidden');
          $('#clear').attr('class', 'nothidden');
      
          $('#name').val(cells.eq(1).text());
          $('#fname').val(cells.eq(2).text());
          $('#email').val(cells.eq(3).text());
          $('#date').val(cells.eq(4).text());
      });
      
      
   
      $('#updateStudent').on('click', function(event) {
        event.preventDefault();
    
        var name = $('#name').val();
        var fname = $('#fname').val();
        var email = $('#email').val();
        var date = $('#date').val();
        console.log(fname);
        if (name && fname && email && date) {
            $.ajax({
                url: `/update-student/${studentId}`,  // Use the global variable here
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ name: name, fname: fname, email: email, date: date }),
                success: function(response) {
                    alert(response.message);
                    fetchStudents();
                },
                error: function(xhr, status, error) {
                    alert('Error updating user:', error);
                }
            });
        } else {
            alert("Please fill out all the fields");
        }
    });


    $(document).on('click', '.delete', function() {

        const row = $(this).closest('tr');
        const studentId = row.find('td:first').text();
        console.log(studentId);
        if(studentId){

            $.ajax({
                url: `/delete-student/${studentId}`,
                method: 'DELETE',
                success: function(response) {
                    alert(response);
                    fetchStudents();
                    
                },
                error: function(error) {
                    alert('Error deleting data:', error);
                }
    
    
            });
        }else{
            alert("Please Select the Record");
        }


    });


    $("#clear").on('click',function(){

        $('#submit').attr('class', 'nothidden');
        $('#updateStudent').attr('class', 'hidden');
        $('#clear').attr('class', 'hidden');

       
        $('#addRowForm')[0].reset();

    });

  

    

});
