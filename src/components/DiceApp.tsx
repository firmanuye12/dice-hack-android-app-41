
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import ConnectionStatus from './ConnectionStatus';
import NumberPad from './NumberPad';
import DiceDisplay from './DiceDisplay';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

const DiceApp: React.FC = () => {
  const [inputData, setInputData] = useState('');
  const [diceValue, setDiceValue] = useState(1);
  const [serverAddress, setServerAddress] = useState('SERVER');
  const firebaseUrl = "https://baru1234-67129-default-rtdb.firebaseio.com/baucua/";

  // Initialize Firebase
  const firebaseConfig = {
    databaseURL: firebaseUrl,
  };
  
  // Initialize Firebase app
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  useEffect(() => {
    // Connect to Firebase
    console.log("Connecting to Firebase at:", firebaseUrl);
    
    // Simulate connection to Firebase
    const timer = setTimeout(() => {
      toast.success('Terhubung ke Firebase', {
        description: `URL: ${firebaseUrl}`,
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNumberClick = (number: number) => {
    setInputData(prev => prev + number);
    // Roll the dice animation when a number is clicked
    setDiceValue(number);
  };

  const handleDeleteClick = () => {
    setInputData(prev => prev.slice(0, -1));
  };

  const handleSend = () => {
    if (inputData) {
      // Send data to Firebase
      const dbRef = ref(database);
      set(dbRef, {
        time: new Date().getTime(),
        results: inputData,
      })
        .then(() => {
          toast.success('Data terkirim!', {
            description: `Value: ${inputData} - Dikirim ke: ${firebaseUrl}`,
          });
          console.log("Sending data to Firebase:", inputData);
          // Reset the input after sending
          setTimeout(() => setInputData(''), 500);
        })
        .catch((error) => {
          toast.error('Gagal mengirim data', {
            description: `Error: ${error.message}`,
          });
          console.error("Error sending data to Firebase:", error);
        });
    } else {
      toast.error('Data kosong', {
        description: 'Silakan masukkan angka terlebih dahulu.',
      });
    }
  };

  const handleLocalhost = () => {
    toast.info('Membuka koneksi server...', {
      description: `Menghubungkan ke ${serverAddress}:8080`,
    });
    // In a real app, this would open a connection to the server
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8 animate-slide-in">
      <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
        <CardHeader className="border-b border-accent/10 pb-4">
          <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Hack Dice
          </CardTitle>
          <CardDescription className="text-center text-foreground/70">
            Modern Dice Controller
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-foreground/70">Server: <span className="font-bold">{serverAddress}</span></p>
            <Button size="sm" variant="outline" onClick={handleLocalhost}>
              Connect Server
            </Button>
          </div>
          
          <ConnectionStatus />
          
          <DiceDisplay value={diceValue} />
          
          <div className="space-y-3">
            <div className="relative">
              <Input
                id="data"
                value={inputData}
                readOnly
                className="bg-secondary/30 border-accent/20 text-center text-xl font-mono h-12"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleSend}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Kirim
              </Button>
              <Button 
                onClick={handleDeleteClick}
                variant="outline"
                className="border-accent/20 hover:bg-secondary/30"
              >
                Hapus
              </Button>
            </div>
          </div>
          
          <NumberPad 
            onNumberClick={handleNumberClick} 
            onDeleteClick={handleDeleteClick}
          />
        </CardContent>
        
        <CardFooter className="border-t border-accent/10 pt-4 flex flex-col items-center justify-center">
          <p className="text-sm text-foreground/60">Modern Dice Controller v1.0</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DiceApp;
