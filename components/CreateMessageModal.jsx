import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, ScrollView, Pressable, TextInput } from "react-native";
import Toast from 'react-native-toast-message';
import ToastFunction from '../config/toastConfig';
import { useDispatch, useSelector } from 'react-redux';
import { createNewMessage, sendPatientMessage } from '../redux/action/MessageAction';
import { fetchAdmin } from '../redux/action/AdminAction';
import Loader from './Loader';

function CreateMessageModal({ modal, setModal }) {
    const dispatch = useDispatch();
    const admin = useSelector((state) => state?.admin?.admin);
    const patientLogin = useSelector((state) => state.patient.patient);
    const messages = useSelector((state) => { return state?.messages?.message });

    const [messageData, setMessageData] = useState({
        adminId: "",
        adminName: "",
        receiverId: patientLogin.patientId,
        messageContent: "",
        type: "CLIENT"
    });

    const [suggestion, setSuggestion] = useState([]);

    const handleChange = (name, text) => {
        if (name === "adminName") {
            const searchAdmin = admin?.filter((val) => (val.firstname).toLowerCase().includes(messageData.adminName.toLowerCase()));
            setSuggestion(searchAdmin);
        }
        setMessageData({ ...messageData, [name]: text })
    };
    // const key = `${messageDetails.adminId}-${messageDetails.receiverId}`;

    const submitButton = () => {
        if (!messageData.adminId || !messageData.adminName || !messageData.messageContent) {
            return ToastFunction("error", "Fill up empty field");
        }
        const key = `${messageData.adminId}-${messageData.receiverId}`;
        const filteredData = messages?.filter((val) => val.roomId === key);
        if (filteredData?.length > 0) {
            dispatch(sendPatientMessage(key, messageData));
        } else {
            dispatch(createNewMessage(key, messageData));
        }
        clearData();
    }
    const clearData = () => {
        setMessageData({
            adminId: "",
            adminName: "",
            receiverId: patientLogin.patientId,
            messageContent: "",
            type: "CLIENT"
        });
        setModal(false);
    }

    useEffect(() => {
        dispatch(fetchAdmin());
    }, [])

    return (
        <>
            {admin?.loading && <Loader loading={admin?.loading} />}
            {
                !admin?.loading && (
                    <View style={{ height: "100%", width: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", position: 'absolute', zIndex: 10, padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: "white", padding: 10, height: "auto", width: "100%" }}>

                            <View style={{ gap: 6 }}>
                                <Text style={{ fontSize: 14, color: "#595959" }}>Search Admin</Text>
                                <TextInput
                                    value={messageData.adminName}
                                    style={{ width: "100%", borderWidth: 1, padding: 6, borderColor: "#ccc", borderRadius: 6 }}
                                    onChangeText={(text) => handleChange("adminName", text)}
                                />
                                {
                                    suggestion?.length > 0 && (
                                        <View style={{ marginTop: 10 }}>
                                            {
                                                suggestion.map((val, idx) => (
                                                    <Text
                                                        key={idx}
                                                        style={{ padding: 10, width: "100%", borderBottomWidth: 1, borderBottomColor: "#ccc" }}
                                                        onPress={() => {
                                                            setMessageData({ ...messageData, adminId: val.adminId, adminName: `Admin ${val.firstname}` });
                                                            setSuggestion([]);
                                                        }}
                                                    >Admin {val.firstname}</Text>
                                                ))
                                            }
                                        </View>
                                    )
                                }
                            </View>

                            {
                                messageData.adminId && messageData.adminName && (
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{ fontSize: 14, color: "#595959" }}>Message Content</Text>
                                        <TextInput
                                            style={{ height: 100, borderColor: 'gray', borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 6 }}
                                            multiline
                                            numberOfLines={4}
                                            placeholder="Type your message here..."
                                            value={messageData.messageContent}
                                            onChangeText={(value) => handleChange("messageContent", value)}
                                        />
                                    </View>
                                )
                            }

                            <View style={{ width: "100%", display: 'flex', flexDirection: 'row', gap: 10, paddingTop: 10 }}>
                                <Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#ef4444", color: "#fff", borderRadius: 6 }} onPress={clearData}>Close</Text>
                                <Text style={{ flex: 1, textAlign: 'center', paddingVertical: 10, backgroundColor: "#06b6d4", color: "#fff", borderRadius: 6 }} onPress={submitButton}>Search</Text>
                            </View>
                        </View>
                        <Toast />
                    </View>
                )
            }
        </>
    );
}

export default CreateMessageModal;