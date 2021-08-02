import React, { useEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import DrawerMenu from "../components/DrawerMenu";
import TabNavigator from "./MainTabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboard from "../screens/onboard";

const Drawer = createDrawerNavigator();

const DrawerMenuContainer = (props: DrawerContentComponentProps) => {
  const { state, ...rest } = props;
  const newState = { ...state };
  newState.routes = newState.routes.filter((item) => item.name !== "Home");
  return (
    <DrawerContentScrollView {...props}>
      <DrawerMenu {...props} />
      <DrawerItemList state={newState} {...rest} />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const [claims, setClaims] = useState<server.Claim[]>([]);

  useEffect(() => {
    async () => {
      const claims = await AsyncStorage.getItem("claims");
      console.log(claims);
      if (claims) {
        setClaims(JSON.parse(claims));
      }
    };
  });

  return (
    <>
      {claims && claims.length > 0 ? (
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={DrawerMenuContainer}
        >
          <Drawer.Screen name="Home" component={TabNavigator} />
        </Drawer.Navigator>
      ) : (
        <Onboard />
      )}
    </>
  );
};

export default DrawerNavigator;
