import bridge from '@vkontakte/vk-bridge'
import AppUsers from './UsersDataList';

class FriendsProcessing{
    id = Math.random() * (10000 - 1000) + 1000;
    user_app_friends = []

    find_friends_in_app(friends){
        for(const friend of friends){
            let friend_id = friend["id"]
            if(Object.keys(AppUsers).includes(friend_id)){
                this.user_app_friends.push(friend);
                console.log("Друг найден");
            };
        };
        console.log(this.user_app_friends);
    };
};

export default FriendsProcessing;
