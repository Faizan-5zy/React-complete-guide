import { useContext, useEffect, useState } from "react";
import RestaurantCard , {withPromotedLabel} from "./RestaurantCard";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../../utils/useOnlineStatus";
// 11
import UserContext from "../../utils/UserContext";


const Body = () => {
  const [listOfRestaurants, setlistOfRestaurants] = useState([]);

  const [filteredRestaurant, setfilteredRestaurant] = useState([]);

  const [searchText, setSearchText] = useState([]);

  const RestaurantCardPromoted = withPromotedLabel(RestaurantCard)

  useEffect(() => {
    fetchData();
  }, []);

  // API call using fetch
  const fetchData = async () => {
    const data = await fetch(
      "https://corsproxy.io/?https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9715987&lng=77.5945627&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
    );
    const json = await data.json();

    const jsonData =
      json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle
        ?.restaurants;
    setlistOfRestaurants(jsonData);
    setfilteredRestaurant(jsonData);
  };

const onlineStatus = useOnlineStatus()
  // 8 custom hook to check online 
  if(!onlineStatus){
    return <h1>You are offline 😓, Please check your connection 💻🔌 </h1>
  }


  // 11

  const {setshowUserName,loggedInUser}=useContext(UserContext)


  return listOfRestaurants?.length === 0 ? (
    <Shimmer />
  ) : (
    <div className="body">
      <div className="filter flex items-center">
        <div className="search p-4 m-4 ">
          <input
            type="text"
            data-testid="searchInput"
            className="border border-solid border-black rounded"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          
          <button
            className="px-4 py-1 bg-green-100 m-4 rounded"
            onClick={() => {
              const filteredRestaurants = listOfRestaurants?.filter((res) =>
                res.info.name.toLowerCase().includes(searchText.toLowerCase())
              );
              setfilteredRestaurant(filteredRestaurants);
            }}
          >
            Search
          </button>
        </div>


        <div
        data-testid="topResBtn" 
        className="top-rated p-4 m-4  ">
        <button
          className="bg-green-100 rounded px-2 py-1 "
          onClick={() => {
            const filteredItems = listOfRestaurants?.filter((res) => {
              return res.info.avgRating > 4.5;
            });
            setfilteredRestaurant(filteredItems);
          }}
        >
          {" "}
          Top Rated Restaurants{" "}
        </button>
        </div>

          {/* 11 */}
        <div className="p-4 m-4  ">
        <input className="border border-black p-2" value={loggedInUser} onChange={(e)=>{setshowUserName(e.target.value)}}/>
        </div>
      </div>

      <div className="res-container flex flex-wrap">
        {filteredRestaurant?.map((restaurant) =>

(
            // console.log('restaurant',restaurant.info.isOpen)
            <Link
             key={restaurant.id}
             to={'/restaurants/'+restaurant.info.id}
             style={{paddingLeft: 13, textDecoration: 'none'}}
             >
             {restaurant.info.isOpen? <RestaurantCardPromoted resData={restaurant} /> :
             <RestaurantCard resData={restaurant} /> }
             </Link>
          )
        
        )
      }
      
      </div>
    </div>
  );
};

export default Body;
