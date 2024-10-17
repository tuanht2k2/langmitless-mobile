import color from "@/assets/styles/color";
import { Interfaces } from "@/data/interfaces/model";
import { RequestInterfaces } from "@/data/interfaces/request";
import accountService from "@/services/accountService";
import { Icon, Input } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDebouncedCallback } from "use-debounce";
import AvatarComponent from "./Avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import IconButtonComponent from "./IconButton";

interface IProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

function MultiSelectAccountComponent(props: IProps) {
  const currentAccount = useSelector((state: RootState) => state.auth.account);
  const [selectedAccount, setSelectedAccount] = useState<Interfaces.IUser[]>(
    []
  );
  const [accounts, setAccounts] = useState<Interfaces.IUser[] | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [keyword, setKeyword] = useState<string>("");

  const [request, setRequest] =
    useState<RequestInterfaces.ICommonSearchRequest>({
      page: 0,
      pageSize: 20,
      keyword: "",
      sortBy: "",
      sortDir: "DESC",
    });

  const debounced = useDebouncedCallback((keyword: string) => {
    if (!keyword) return;
    setRequest((prev) => ({ ...prev, keyword }));
  }, 1000);

  const handleSearch = async (
    request: RequestInterfaces.ICommonSearchRequest
  ) => {
    setLoading(true);
    const res = await accountService.search(request);
    const accounts: Interfaces.IUser[] | null = res?.data?.data;
    if (accounts)
      setAccounts(
        accounts.filter(
          (account) =>
            !selectedAccount.map((item) => item.id).includes(account.id)
        )
      );

    setLoading(false);
  };

  const addAccount = (account: Interfaces.IUser) => {
    setSelectedAccount((prev) => [...prev, account]);
    setAccounts([]);
  };

  const removeAccount = (id: string) => {
    setSelectedAccount((prev) => {
      return prev.filter((account) => account.id != id);
    });
  };

  useEffect(() => {
    if (!request.keyword) return;
    handleSearch(request);

    return () => {};
  }, [request]);

  return (
    <View style={{ padding: 10 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 10,
          paddingLeft: 5,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Icon
            name="arrow-back"
            size={24}
            color={color.primary}
            style={{ marginRight: 10 }}
            onPress={props.onClose}
          />
          <Text style={{ fontWeight: "500", fontSize: 15 }}>
            Tạo cuộc trò chuyện mới
          </Text>
        </View>
        <IconButtonComponent
          label="Tạo mới"
          labelColor={color.white}
          color={color.primary}
          onPress={() => {
            props.onSubmit(selectedAccount.map((account) => account.id));
          }}
        />
      </View>
      <ScrollView style={{}}>
        <View
          style={{
            paddingHorizontal: 10,
            gap: 10,
            display: "flex",
            flexDirection: "row",
          }}
        >
          {selectedAccount.length > 0 &&
            selectedAccount.map((account, index) => {
              return (
                <View
                  style={{ position: "relative", height: 50, width: 50 }}
                  key={index}
                >
                  <Image
                    source={
                      account.profileImage
                        ? { uri: account.profileImage }
                        : require("@/assets/images/default_avt.png")
                    }
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: 100,
                    }}
                  />
                  <View style={{ position: "absolute", right: -7, top: -7 }}>
                    <IconButtonComponent
                      icon="close"
                      size={20}
                      onPress={() => {
                        removeAccount(account.id || "");
                      }}
                    />
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
      <Input
        inputStyle={{
          fontSize: 15,
          borderWidth: 0,
          height: 20,
        }}
        value={keyword}
        onChangeText={(value: string) => {
          setKeyword(value);
          debounced(value);
        }}
        placeholder="Tìm kiếm..."
        rightIcon={
          <Icon
            name="search"
            size={24}
            color={color.primary}
            style={{ marginLeft: 10 }}
          />
        }
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          {accounts && accounts.length > 0 && (
            <View style={{ gap: 5, paddingHorizontal: 10 }}>
              {accounts.map((account, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    disabled={currentAccount?.id == account.id}
                    onPress={() => {
                      addAccount(account);
                    }}
                    style={{
                      padding: 10,
                      backgroundColor: color.lightGrey,
                      borderRadius: 10,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 15,
                    }}
                  >
                    <AvatarComponent imageUrl={account.profileImage} />
                    <Text style={{ fontWeight: 500 }}>
                      {account.displayName}
                    </Text>
                    {currentAccount?.id == account.id && (
                      <Text style={{ fontWeight: 500, color: color.grey }}>
                        ( Bạn)
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {(!accounts || accounts.length == 0) && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="hourglass-disabled" color={color.darkGrey} />
              <Text style={{ color: color.darkGrey }}>
                Không có kết quả phù hợp
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

export default MultiSelectAccountComponent;
