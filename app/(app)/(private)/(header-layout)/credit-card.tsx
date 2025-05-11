import color from "@/assets/styles/color";
import AvatarComponent from "@/components/Avatar";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Divider from "@/components/Divider";
import IconButtonComponent from "@/components/IconButton";
import ModalComponent from "@/components/Modal";
import { ComponentInterfaces } from "@/constants/component";
import { BANKS } from "@/constants/constant";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { overlayLoaded, overlayLoading } from "@/redux/reducers/globalSlide";
import { RootState } from "@/redux/store";
import CommonService from "@/services/CommonService";
import creditCardService from "@/services/creditCardService";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Image, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

function CreditCardScreen() {
  const account = useSelector((state: RootState) => state.auth.account);
  const loading = useSelector(
    (state: RootState) => state.global.isOverlayLoading
  );

  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  const [creditCard, setCreditCard] =
    useState<ResponseInterfaces.ICreditCard | null>(null);
  const [creditCardInfo, setCreditCardInfo] = useState<
    ComponentInterfaces.IDropdownOption<string> | undefined | null
  >(null);

  const getCardDetails = async () => {
    try {
      dispatch(overlayLoading());
      const res: ResponseInterfaces.ICommonResponse<ResponseInterfaces.ICreditCard> =
        await creditCardService.getDetails();
      dispatch(overlayLoaded());

      if (!res || res.code != 200 || !res.data) {
        CommonService.showError();
        return;
      }
      setCreditCard(res.data);
      setCreditCardInfo(getBankData(res.data?.bank));
    } catch (error) {
      CommonService.showError();
      dispatch(overlayLoaded());
    }
  };

  useEffect(() => {
    getCardDetails();
  }, []);

  const getBankData = (code: string | undefined) => {
    if (!code) return;
    return BANKS.find(
      (item: ComponentInterfaces.IDropdownOption<string>) => (item.code = code)
    );
  };

  const { control, setValue } = useForm({
    defaultValues: {
      bank: "",
      cardNumber: "",
    },
  });

  const editCreditCard = () => {
    try {
      setModalVisible(true);
      setValue("cardNumber", creditCard?.cardNumber || "");
    } catch (error) {
      console.error("An error happened when editCreditCard: ", error);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      {!loading && !creditCard && (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Button
            title="Thiết lập thẻ tín dụng"
            style={{ backgroundColor: color.textBlue1 }}
            onClick={() => {
              setModalVisible(true);
            }}
          />
        </View>
      )}
      {creditCard && creditCardInfo && (
        <Card
          styles={{
            width: "100%",
            borderWidth: 1,
            borderColor: color.yellow3,
            position: "relative",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              justifyContent: "space-around",
            }}
          >
            <AvatarComponent imageUrl={account?.profileImage} size={40} />
            <Divider direction="VERTICAL" />
            <View>
              <Text style={{ fontWeight: "500" }}>
                {getBankData(creditCard.bank)?.name}
              </Text>
              {creditCardInfo.img && (
                <Image
                  source={creditCardInfo?.img}
                  style={{ height: 40, width: 40, objectFit: "contain" }}
                />
              )}
            </View>
            <Divider direction="VERTICAL" />
            <View style={{ gap: 5 }}>
              <Text style={{ color: color.grey3 }}>Số tài khoản</Text>
              <Text style={{ fontWeight: "600" }}>{creditCard.cardNumber}</Text>
            </View>
          </View>
          <Divider direction="HORIZONTAL" />
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginTop: 20,
            }}
          >
            <Image
              src={creditCard.qrImage}
              style={{
                height: 300,
                width: 300,
                borderRadius: 20,
                objectFit: "contain",
              }}
            />
          </View>
          <IconButtonComponent
            icon="edit"
            size={20}
            iconColor={color.blue1}
            style={{ position: "absolute", top: 0, right: 0 }}
          />
        </Card>
      )}
      <ModalComponent
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        showHeader
        title="Thiết lập thẻ"
      >
        <View></View>
      </ModalComponent>
    </ScrollView>
  );
}

export default CreditCardScreen;
