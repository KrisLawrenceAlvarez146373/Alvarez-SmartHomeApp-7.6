import {Ionicons} from '@expo/vector-icons';

type Device = {
    id: number;
    name: string;
    type: string;
    icon: keyof typeof Ionicons.glyphMap;
    status: boolean;
};  

type SensorData = {
    temperature: number;
    humidity: number;
    lightLevel: number;
};

export default function IoTmodels(){
return (
    // const Devices:Device = {
    //     {
    //         id: 1,
    //         name: 'Living Room Light',
    //         shortName: 'Light',
    //         status: 'ON',
    //         icon: 'bulb',
    //         color: '#F59E0B',
    //       },
    // }
);
}