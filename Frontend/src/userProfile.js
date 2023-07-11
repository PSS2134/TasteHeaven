import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import "./userProfile.css";
import user from "./Images/user.png";
import cart_icon from "./Images/Menu/icons8-cart-48.png";
import Footer from "./Footer";
import Spinner from "./Spinner";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile({ updateUser }) {
  const [order, setOrder] = useState({});
  
  const Logout = () => {
    localStorage.removeItem("Data");
    const user = localStorage.getItem("Data");
    toast.success("Thanks for Visiting Menu");
    updateUser(user);
  };
  const email = JSON.parse(localStorage.getItem("Data")).email;

  useEffect(() => {
    fetch(`http://localhost:5000/api/profile?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setLoading(false);
        setOrder(data);
      });
  }, []);
  console.log(order);

  const [data, setData] = useState({});
  const [picture, setPicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const postDetails = async (picture) => {
    // console.log(picture);
    console.log("hemlo");
    setLoading(true);
    if (picture == undefined) {
      toast.warning("Please Upload a image");
      return;
    } else if (picture.size >= 1048576) {
      toast.warning("The size of image is greater than 1mb");
      setLoading(false);
      return;
    }
    const data = new FormData();
    data.append("file", picture);
    data.append("upload_preset", "tc3augsj");
    try {
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dcbrlaot1/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urlData = await res.json();
      // console.log(urlData.url);
      setPicture(urlData.url.toString());
      setLoading(false);
      setImagePreview(URL.createObjectURL(picture));
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleImage = async (e) => {
    const res = await fetch("http://localhost:5000/api/image", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, picture }),
    });
    const data = await res.json();
    if (data === "image Uploaded succesfully") {
      setLoading(false);
      window.location.reload();
      toast.success("Image uploaded successfully");
    } else {
      setLoading(false);
      toast.error("Try again!");
    }
  };
  const showPopup=()=>{
    toast.warn("Tap on Image to change !")
  }
  return (
    <>
      {/*Navbar Here */}
      {loading?<Spinner title={"Setting up Your Profile :)"}/>:<>      <div className="navbar">
        <div className="left">
          <span class="material-symbols-rounded">menu</span>
          <div className="logo"> Taste Heaven</div>
        </div>
        <ul className="right">
          <li>
            <a href="/">Home</a>
          </li>

          <li>
            <a href="/menu">Menu</a>
          </li>
          <li>
            <Link
              to="contact"
              spy={true}
              smooth={true}
              offset={-10}
              duration={500}
            >
              Contact
            </Link>
          </li>
          <li>
            <a href="/menu/cart">
              <img className="menu-nav-cart-icon" src={cart_icon} />
            </a>
          </li>
          <li>
              <a href="/profile"><img src={user}/></a>
            </li>
          <li>

            <button className="Menu-Logout-button" onClick={Logout}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      <p className="userProfile-header" style={{ backgroundColor: "#f5f5f5" }}>
        Hey! See your all orders here..
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div className="userprofile-box" style={{ padding: "0 3%" }}>
      
                      <label
                        htmlFor="image-upload"
                        className="image-upload-label"
                      >
                        <img
                      onMouseOver={showPopup}
                       src={imagePreview || order.picture}
                        className="userProfile-userimg"
                      />
                        {/* <FontAwesomeIcon icon="fa-solid fa-circle-plus" style={{color: "#22a607",}} /> */}
                        
                        
                      </label>
                      <input
                        type="file"
                        id="image-upload"
                         hidden
                        accept="image/png, image/jpeg"
                        onChange={(e) => postDetails(e.target.files[0])}
                      />
       {picture && <button style={{"padding":"4%","marginTop":"5%","width":"50%","borderRadius":"10px","backgroundColor":"blueviolet","color":"white","border":"none","boxShadow":"2px 2px 2px black"}} onClick={handleImage}>Save</button>}   
        </div>
        <div className="userProfile-profile">
          <div className="userProfile-profile-content">
            <p className="userProfile-label">Name</p>
            <input
              className="userProfile-input"
              type="text"
              value={order.name}
            />
          </div>
          <div className="userProfile-profile-content">
            <p className="userProfile-label">Email</p>
            <input
              className="userProfile-input"
              type="text"
              value={order.email}
            />
          </div>
          <div className="userProfile-profile-content">
            <p className="userProfile-label">Contact</p>
            <input
              className="userProfile-input"
              type="text"
              value={order.contact}
            />
          </div>
          
        </div>
      </div>
   
      <div>
    <div style={{"backgroundColor":"#f5f5f5","padding":"2% 0"}}>
      
    <div style={{"height":"90vh","overflowY":"scroll","backgroundColor":"#f5f5f5"}}>
              <table  >
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Order Items</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Amount</th>
                    <th>Address</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>

                  {order.orderArray &&
                    order.orderArray.map((SingleOrder) => {
                      return (
                        <tr>
                          <td>{SingleOrder.order_id}</td>
                          {/* <td>{singleOrder.food}</td> */}
                          <td>
        {SingleOrder.food && SingleOrder.food.map((singleFood)=>{
         return(
           <b><span style={{"padding":"20px 10px"}}>{singleFood.quantity} x {singleFood.title},</span></b>
         )
        })}
     </td>
                          <td>{SingleOrder.date}</td>
                          <td>{SingleOrder.time}</td>
                          <td>Rs {SingleOrder.Total_Price}</td>
                          <td>
                            <div
                              style={{ width: "25vw", border: "none"}}
                              
                            >
                              <p style={{"padding":"10px 10px"}}>{SingleOrder.contact}</p>
                              <p style={{"padding":"10px 10px"}}>{SingleOrder.flatno}</p>
                              <p style={{"padding":"10px 10px"}}>{SingleOrder.address}</p>
                              <p style={{"padding":"10px 10px"}}>{SingleOrder.landmark}</p>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              </div>
              </div>
         
      </div>
      <Footer /></>}

    </>
  );
}
export default Profile;