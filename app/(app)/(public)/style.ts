import color from "@/assets/styles/color";
import { Animated, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    paddingHorizontal: 20,
    minHeight: "100%",
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 65,
  },
  logo: {
    width: 110,
    height: 80,
    resizeMode: "contain",
  },
  logoTitle: {
    color: color.textMain,
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 35,
    position: "relative",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  errorTextWrapper: {
    position: "absolute",
    bottom: -10,
    left: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  errorText: {
    color: "#ad0202",
    fontSize: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#4285F4",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "97%",
    marginTop: 20,
  },
  linkText: {
    color: color.white1,
    fontSize: 14,
  },
});

export default styles;
