import React from 'react'
import { View, Text, FlatList } from 'react-native'
import comments from '../../assets/data/comments.json'
import Comment from '../../components/Comment'
import Input from './Input'

const CommentScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={comments}
        renderItem={({ item, index }) => <Comment comment={item} includeDetails />}
        style={{ padding: 10, }}
      />
      <Input />
    </View>
  )
}

export default CommentScreen