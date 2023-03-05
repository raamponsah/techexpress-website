
import '../../layouts/form.css'

export default function BookingForm(){

    const handleFormSubmission =  (e)=>{
        e.preventDefault()
        console.log("Hello",e.target)
   
    }

    return <>
        <form name="contact" method="POST" netlify>

<div class="input-holder">
    <label for="fullname">Fullname</label>
    <input type="text" name="fullname" id="fullname"></input>
</div>

<div class="input-holder">
    <label for="fullname">Email</label>
    <input type="email" placeholder="you@example.com" required name="email" id="email"></input>
</div>

<div class="input-holder">
    <label for="phone">Phone</label>
    <input type="text" required name="phone" id="phone"></input>
</div>

<div class="input-holder">
    <label for="date">Date and Time for meet</label>
    <input type="datetime-local" name="date" id="date"></input>
</div>

<div class="message">
    <label for="message">Additional Message</label>
    <textarea name="message" id="message" cols="30" rows="10" ></textarea>
</div>

<button class="secondary" type="submit">Submit</button>
</form>
    </>
    
}