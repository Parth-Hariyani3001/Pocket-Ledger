import { format } from "date-fns";

export const timestampToDate = (timestamp: string) => format(new Date(timestamp), 'dd/MM/yyyy');

export const formatINR = (value: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(value);