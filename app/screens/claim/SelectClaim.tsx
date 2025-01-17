import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { View, ViewStyle, Switch, StyleSheet, Text } from "react-native";
import { IClaim } from "../../store/assetStore";
import styles from "../../styles";
import Button from "../../components/Button";
import { verifyClaim } from "../../helpers/claim/verify";

const SelectClaim = ({
  item,
  imageInfo,
  displayFileName,
  uploadPhotoFromCamera,
  uploadFileFromBrowser,
  uploadPhotoFromLibrary,
}: {
  item: IClaim;
  imageInfo: any;
  displayFileName: boolean;
  uploadPhotoFromCamera: () => void;
  uploadFileFromBrowser: () => void;
  uploadPhotoFromLibrary: () => void;
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    item.value === "false" ? item.setValue("true") : item.setValue("false");
  };
  useEffect(() => {
    if (item.value === undefined) {
      toggleSwitch();
    }
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          ...styles.claim.input,
          width: styles.layout.window.width,
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <View
          style={
            item.value === "true"
              ? styless.toggleTrueStyle
              : styless.toggleFalseStyle
          }
        >
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={item.value === "true" ? true : false}
          />
        </View>
      </View>
      {displayFileName && (
        <Text style={{ bottom: 280, textAlign: "center" }}>
          {imageInfo.name}
        </Text>
      )}
      <Button
        title="Take a photo"
        style={styles.claim.cameraUploadButton as ViewStyle}
        onPress={uploadPhotoFromCamera}
      />
      <Button
        title="Upload a document"
        style={styles.claim.uploadButton as ViewStyle}
        onPress={uploadFileFromBrowser}
      />
      <Button
        title="Add a photo from library"
        style={styles.claim.libraryUploadButton as ViewStyle}
        onPress={uploadPhotoFromLibrary}
      />
      <Button
        title="Verify"
        style={styles.claim.verifyButton as ViewStyle}
        disabled={true}
        onPress={() => verifyClaim(item)}
      />
    </View>
  );
};

const styless = StyleSheet.create({
  toggleFalseStyle: {
    backgroundColor: "#767577",
    borderRadius: 50,
  },
  toggleTrueStyle: {
    backgroundColor: "#81b0ff",
    borderRadius: 50,
  },
});

export default observer(SelectClaim);
