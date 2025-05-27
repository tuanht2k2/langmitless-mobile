import { Interfaces } from "./model";

export namespace ResponseInterfaces {
  export interface ICommonResponse<T> {
    code: number;
    data: T;
    message: string;
  }

  export interface ICommonSearchResponse<T> {
    totalRecords: number;
    recordSize: number;
    list: T[];
  }

  // auth
  export interface ILoginResponse {
    token: string;
    data: Interfaces.IUser;
  }

  export interface IFileResponse {
    id: string;
    url: string;
    type: "MP3" | "MP4" | "IMG" | "DOC";
    postId: string;
  }

  export interface IMessengerResponse {
    id?: string;
    updatedAt?: Date;
    name?: string;
    type?: "GROUP" | "PERSONAL" | "CHATBOT";
    image?: string;
    members?: Interfaces.IUser[];
    messages?: IMessageResponse[];
  }

  export interface IMessageResponse {
    id: string;
    messengerId?: string;
    createdAt?: Date;
    createdBy?: Interfaces.IUser;
    content?: string;
    fileUrl?: string;
  }

  export interface INotificationResponse {
    message?: string;
    message2?: string;
  }

  export interface IRoomResponse extends Interfaces.IEntity {
    hire?: IHireResponse;
    members?: Interfaces.IUser[];
    expectedCallDuration?: number;
    actualCallDuration?: number;
    status?: "IN_PROGRESS" | "FINISHED";
  }

  export interface IHireResponse extends Interfaces.IEntity {
    teacher?: Interfaces.IUser;
    cost?: number;
    totalTime?: number;
    status?: "ACCEPTED" | "REJECTED" | "PENDING" | "ENDED";
    room?: IRoomResponse;
    actualTime?: number;
  }

  export interface ICourseResponse extends Interfaces.IEntity {
    id?: string;
    name?: string;
    description?: string;
    cost?: number;
    language?: string;
    level?: number;
    members?: Interfaces.IAccount[];
    topics?: ITopicResponse[];
    isMember?: boolean;
  }

  export interface ITopicResponse extends Interfaces.IEntity {
    id?: string;
    description?: string;
    tag?: ITagResponse;
    type?: "EXERCISE" | "EXAM";
  }

  export interface ITagResponse {
    id?: string;
    name?: string;
    language?: string;
  }

  export interface IChatbotResponse {
    message: string;
    courses?: ICourseResponse[];
    type?: "ASK" | "ANSWER";
  }

  export interface IOtpResponse {
    correct?: boolean;
    remainSent?: number;
    retryTime?: number;
  }

  export interface IQuestionResponse extends Interfaces.IEntity {
    id?: string;
    courseId?: string;
    type?: string;
    content?: string;
    audioSample?: string | null;
    textSample?: string;
    answer?: string; // Student answered
    answerAudio?: string; // Student answered => used for PRONUNCIATION
    option?: IOptionResponse[] | null;
    members?: Interfaces.IAccount[];
    topics?: ITopicResponse[];
    topicId?: string;
    score?: number;
  }

  export interface ITransactionScore {
    topicId?: string;
    userId?: string;
    transactionId?: string;
    score?: number;
    questions?: IQuestionResponse[];
  }

  export interface IOptionResponse {
    id: string;
    content: string;
    correct: boolean;
  }

  export interface IAnswerPronunciationScore {
    pronunciationScore: number;
    score: number;
  }

  export interface IQuestionScore {
    pronunciationScore: number;
    score: number;
  }

  export interface ICreditCard {
    cardNumber?: string;
    bank?: string;
    accountId?: string;
    qrImage?: string;
  }

  export interface ICreditCard {
    cardNumber?: string;
    bank?: string;
    accountId?: string;
    qrImage?: string;
  }
}
