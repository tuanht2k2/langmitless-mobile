import * as Contacts from "expo-contacts";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { Interfaces } from "@/data/interfaces/model";
import accountService from "@/services/accountService";
import CommonService from "@/services/CommonService";
import AvatarComponent from "./Avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

function SuggestAccount() {
  const router = useRouter();
  const currentAccount = useSelector((state: RootState) => state.auth.account);

  const [accounts, setAccounts] = useState<Interfaces.IAccount[]>([]);

  const handleNavigate = (id: string) => {
    router.push(`/account/${id}`);
  };

  const getAccounts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const phoneNumbers: string[] = data
          .filter(
            (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
          )
          .map((contact) => contact?.phoneNumbers?.[0]?.number || "");
        const request = {
          phoneNumbers: phoneNumbers,
        };
        const response = await accountService.searchByPhoneNumbers(request);
        if (!response || response.data.code == "403") {
          CommonService.showToast("error", "Lỗi máy chủ nội bộ");
          return;
        }
        setAccounts(response.data.data);
      }
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <View>
      <Text>Người dùng trong danh bạ</Text>
      {
        <ScrollView horizontal>
          {accounts
            .filter(
              (account: Interfaces.IAccount) =>
                account.id !== currentAccount?.id
            )
            .map((account: Interfaces.IAccount, index) => (
              <AvatarComponent
                key={index}
                accountUrl={account.id}
                imageUrl={account.profileImage}
              />
            ))}
        </ScrollView>
      }
      <Toast />
    </View>
  );
}

export default SuggestAccount;
