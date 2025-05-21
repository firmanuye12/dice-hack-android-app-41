
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import ConnectionStatus from './ConnectionStatus';
import NumberPad from './NumberPad';
import DiceDisplay from './DiceDisplay';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const DiceApp: React.FC = () => {
  const [inputData, setInputData] = useState('');
  const [diceValue, setDiceValue] = useState(1);
  const [serverAddress, setServerAddress] = useState('SERVER');
  const [isConnected, setIsConnected] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  // URL Firebase yang sama dengan yang digunakan APK
  const firebaseRootUrl = "https://baru1234-67129-default-rtdb.firebaseio.com";
  const firebasePath = "baucua";

  // Initialize Firebase with the correct root URL
  const firebaseConfig = {
    databaseURL: firebaseRootUrl,
  };
  
  // Initialize Firebase app
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  useEffect(() => {
    // Connect to Firebase
    console.log("Menghubungkan ke Firebase:", firebaseRootUrl);
    
    // Membuat referensi ke Firebase
    const dbRef = ref(database, firebasePath);
    
    // Uji koneksi ke Firebase dengan mencoba mendapatkan data
    onValue(dbRef, (snapshot) => {
      console.log("Koneksi ke Firebase berhasil, data terakhir:", snapshot.val());
      setFirebaseConnected(true);
      setIsConnected(true); // Update koneksi secara langsung saat berhasil
      toast.success('Terhubung ke Firebase', {
        description: `URL: ${firebaseRootUrl}/${firebasePath}`,
      });
    }, (error) => {
      console.error("Gagal terhubung ke Firebase:", error);
      setFirebaseConnected(false);
      setIsConnected(false); // Update koneksi secara langsung saat gagal
      toast.error('Gagal terhubung ke Firebase', {
        description: `Error: ${error.message}`,
      });
    });
    
    // Set up connection status check
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    // Initial check
    handleOnlineStatusChange();
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // Cek status koneksi internet dan Firebase
  const handleOnlineStatusChange = () => {
    const isOnline = navigator.onLine;
    console.log("Status koneksi internet:", isOnline ? "Online" : "Offline");
    // Hanya ubah status koneksi jika tidak online
    if (!isOnline) {
      setIsConnected(false);
      toast.error('Koneksi Internet Terputus', {
        description: 'Mohon periksa koneksi internet Anda',
      });
    }
    // Jika online, status koneksi akan diperbarui oleh callback Firebase onValue
  };

  const handleNumberClick = (number: number) => {
    setInputData(prev => prev + number);
    
    // Set the dice value to match the number clicked
    setDiceValue(number);
  };

  const handleDeleteClick = () => {
    setInputData(prev => prev.slice(0, -1));
  };

  const handleSend = () => {
    if (inputData) {
      // Kirim data ke Firebase dalam format yang kompatibel dengan APK
      const dbRef = ref(database, firebasePath);
      
      // PENTING: Mengubah format data agar sesuai dengan yang diharapkan oleh APK
      // APK mengharapkan results sebagai string (seperti "123")
      set(dbRef, {
        time: new Date().getTime(),
        results: inputData, // Kirim inputData langsung sebagai string
      })
        .then(() => {
          toast.success('Sukses!', {
            description: `Data: ${inputData} berhasil dikirim ke APK dadu`,
            duration: 3000,
          });
          console.log("Mengirim data ke Firebase:", inputData);
          // Reset input setelah mengirim
          setTimeout(() => setInputData(''), 500);
        })
        .catch((error) => {
          toast.error('Gagal mengirim data', {
            description: `Error: ${error.message}`,
            duration: 5000,
          });
          console.error("Error mengirim data ke Firebase:", error);
        });
    } else {
      toast.error('Data kosong', {
        description: 'Silakan masukkan angka terlebih dahulu.',
      });
    }
  };

  const handleLocalhost = () => {
    if (!isConnected) {
      toast.info('Mencoba menghubungkan ulang...', {
        description: `Menghubungkan ke Firebase: ${firebaseRootUrl}/${firebasePath}`,
      });
      
      // Coba sambungkan ulang ke Firebase
      const dbRef = ref(database, firebasePath);
      onValue(dbRef, (snapshot) => {
        console.log("Koneksi ke Firebase berhasil setelah percobaan ulang:", snapshot.val());
        setFirebaseConnected(true);
        setIsConnected(true);
        toast.success('Berhasil terhubung kembali!', {
          description: `URL: ${firebaseRootUrl}/${firebasePath}`,
        });
      }, (error) => {
        console.error("Gagal menghubungkan ulang ke Firebase:", error);
        toast.error('Gagal menghubungkan ulang', {
          description: error.message,
        });
      });
    } else {
      toast.info('Sudah terhubung', {
        description: `Anda sudah terhubung ke Firebase: ${firebaseRootUrl}/${firebasePath}`,
      });
    }
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
            <p className="text-sm font-medium text-foreground/70">Server: <span className="font-bold">{firebaseRootUrl}/{firebasePath}</span></p>
            <Button size="sm" variant="outline" onClick={handleLocalhost}>
              {isConnected ? "Refresh Koneksi" : "Hubungkan Ulang"}
            </Button>
          </div>
          
          <ConnectionStatus isConnected={isConnected} />
          
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
                disabled={!isConnected || !inputData}
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
          <p className="text-sm text-foreground/60">Modern Dice Controller v1.0 by udin</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DiceApp;
