import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function DetailPesanan() {
  let [loading, setLoading] = useState(true);
  let [total, setTotal] = useState(0);
  let [listPesanan, setListPesanan] = useState([]);
  let { customerId } = useParams();
  useEffect(() => {
    getDetailPesananUntukUser();
  }, []);

  async function getDetailPesananUntukUser() {
    try {
      const response = await axios.get(
        `http://localhost:8000/pesanan/${customerId}`
      );
      setListPesanan(response.data.data);
      setLoading(false);

      setTotal(
        response.data.data.reduce((acc, pesanan) => {
          const harga = pesanan.Kendaraan.harga * pesanan.jumlah_kendaraan;
          return acc + harga;
        }, 0)
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="h-fit">
      <h1 className="text-3xl">Pesanan - {customerId}</h1>
      <div className="w-full">
        <div className="flex justify-end content-end gap-4">
          <Link to="/" className={buttonVariants({ variant: 'default' })}>
            Balik ke Pesanan
          </Link>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="pt-8 w-4/5">
          {listPesanan.map((pesanan) => {
            return (
              <Card className="mt-4">
                <CardHeader>
                  <CardContent className="flex justify-center">
                    <img
                      src={`http://localhost:8000/${pesanan.Kendaraan.gambar}`}
                      className="w-24"
                    />
                  </CardContent>
                  <CardTitle>
                    {pesanan.jumlah_kendaraan}x {pesanan.Kendaraan.manufaktur} -{' '}
                    {pesanan.Kendaraan.model} {pesanan.Kendaraan.tahun}
                  </CardTitle>
                  <CardDescription>{pesanan.Kendaraan.harga}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
      <div>
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Harga Total: {total}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

export default DetailPesanan;
