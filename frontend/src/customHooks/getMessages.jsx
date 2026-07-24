import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const getMessage = () => {
  const dispatch = useDispatch();
  const { userData, selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!selectedUser?._id || !userData) {
      dispatch(setMessages([]));
      return;
    }

    let cancelled = false;
    const fetchMessages = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          { withCredentials: true }
        );
        if (!cancelled) {
          dispatch(setMessages(result.data || []));
        }
      } catch (error) {
        console.log(error);
        if (!cancelled) dispatch(setMessages([]));
      }
    };

    fetchMessages();
    return () => {
      cancelled = true;
    };
  }, [selectedUser?._id, userData, dispatch]);
};

export default getMessage;
