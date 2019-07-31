import React from 'react'

import {
    CameraRoll,
    Dimensions,
    FlatList,
    Image,
    PermissionsAndroid,
    TouchableOpacity,
    View,
} from 'react-native'

export default class App extends React.Component {
    state = {
        imageUris: [],
    }
    
    componentDidMount() {
        this.GetPhotos()
    }

    async GetPhotos() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                'title': 'Get Gallerry Image App Permission',
                'message': 'Get Gallerry Image App needs access to your camera so you can take awesome pictures.'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                CameraRoll.getPhotos({
                    first: 20,
                    assetType: 'All'
                })
                .then(r => {
                    let imageUris = []

                    for(let imageUrisIndex = 0; imageUrisIndex < r.edges.length; imageUrisIndex++) {
                        imageUris.push(r.edges[imageUrisIndex].node.image.uri)
                    }
        
                    this.setState({ imageUris: imageUris })
                })
            } else {
                console.log("Read external storage permission denied")
            }
            } catch (err) {
            console.warn(err)
        }
    }

    render() {
        return (
            <View
                style = {{
                    flex: 1,
                }}
            >
                <FlatList
                    data = {this.state.imageUris}
                    numColumns = {2}
                    keyExtractor = {(item, index) => index.toString()}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity
                                style = {{
                                    backgroundColor: "black",
                                    padding: 2,
                                }}
                            >
                                <Image
                                    resizeMode = "cover"
                                    source = {{uri: item}}
                                    style = {{
                                        height: Dimensions.get("screen").width / 2,
                                        width: Dimensions.get("screen").width / 2,
                                    }}
                                />
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    }
}