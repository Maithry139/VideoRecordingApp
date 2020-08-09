import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Modal, ActivityIndicator, FlatList, Image, TouchableOpacity, Dimensions, Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Video } from "expo-av";

import Paths from '../Paths/paths';
import CameraPV from '../CameraPV';

const WINDOW_HEIGHT = Dimensions.get("window").height;
const WINDOW_WIDTH = Dimensions.get("window").width;

export default function RecordVideo() {

  const [appFiles, setFiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  getAllFiles = useCallback(() => {
    if (!Paths.files) {
      setLoading(false);
      return;
    }
    FileSystem.readDirectoryAsync(Paths.files).then(files => {
      let allFiles = files.map(file => {
        return `${Paths.files}/${file}`
      });
      console.log(allFiles);
      setFiles(allFiles);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    createAppFolder(Paths.files);
  }, []);

  const createAppFolder = (path) => {
    return FileSystem.getInfoAsync(path).then(({ exists }) => {
      if (!exists) {
        return FileSystem.makeDirectoryAsync(path)
      } else {
        getAllFiles();
      }
    })
  }

  const getExtension = (uri) => {
    const arr = uri.split('.');
    if (arr[arr.length - 1] === 'jpg') {
      return 'Image';
    }
    else return 'Video';
  }
  const base = FileSystem.documentDirectory;
  const UTC = new Date().getTime();
  const id = `VID-${UTC}.mp4`;
  const path = `${Paths.files}/${id}`;

  const onShare = async () => {
    try {
      const result = await Share.share({ 
        url: path,
           message: 'You are sharing the Video'
      });
      console.log("opening url " + path);
        
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const playVideo = (uri) => {
    setVideoModalVisible(true);
    setCurrentVideo(uri);
  }

  const deleteItem = async (uri) => {
    FileSystem.deleteAsync(uri)
      .then(() => getAllFiles());
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="auto" backgroundColor='#f2f2f2' />
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    )
  }
  else return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor='#f2f2f2' />
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={{ padding: 10, marginTop: 40, borderWidth: 1, borderRadius: 5, margin: 10 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Camera</Text>
      </TouchableOpacity>
      {
        appFiles.length > 0 && <FlatList
          data={appFiles}
          keyExtractor={item => item}
          horizontal={false}
          numColumns={2}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => getExtension(item) === 'Video' && playVideo(item)}
                onLongPress={onShare}
                activeOpacity={1}
                style={{ borderRadius: 15, margin: 10, flex: 0.5 }}>
                <Image
                  style={{ width: '100%', height: 200, borderRadius: 10, marginTop: 10 }}
                  source={{ uri: item }} />
                <View
                  style={{
                    flex: 1,
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                    height: '100%',
                    width: '100%'
                  }}>
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>{getExtension(item)}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => deleteItem(item)}
                  style={{
                    position: 'absolute',
                    top: 15,
                    right: 10,
                    padding: 5,
                    zIndex: 5
                  }}>
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>X</Text>
                </TouchableOpacity>

              </TouchableOpacity>
              
            )
            
          }
          
        } />
      }

      {
        videoModalVisible && currentVideo &&
        <Modal
          style={{ flex: 1, width: WINDOW_WIDTH, height: WINDOW_HEIGHT }}
          animationType="slide"
          transparent={true}
          visible={videoModalVisible}
          onRequestClose={() => {
            setVideoModalVisible(false)
            setCurrentVideo(null);
          }}>

          <Video
            source={{ uri: currentVideo }}
            shouldPlay={true}
            style={styles.media}
          />
        </Modal>
      }

      {
        modalVisible &&
        <Modal
          style={{ flex: 1 }}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => { setModalVisible(false) }}>
          <CameraPV getAllFiles={getAllFiles} />
        </Modal>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
});
