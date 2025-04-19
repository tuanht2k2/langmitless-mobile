import React from "react";
import {Slot, Stack} from "expo-router";
import CourseProvider from "@/contexts/courseContext/CourseProvider";



function TopicsLayout () {
    return (
        <CourseProvider>
            <Slot />
        </CourseProvider>
    );
}
export default TopicsLayout;
