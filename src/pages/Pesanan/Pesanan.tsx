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

function Pesanan() {
  const [allCustomers, setAllCustomers] = useState([]);
  const [kendaraanLength, setKendaraanLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    getAllUsers();
  }, []);

  async function getAllUsers() {
    try {
      const customers = await axios.get('http://localhost:8000/customer');
      const kendaraan = await axios.get('http://localhost:8000/kendaraan');
      setKendaraanLength(kendaraan.data.data.length);
      setAllCustomers(customers.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message);
    }
  }

  async function deleteUser(id) {
    try {
      const customer = await axios.delete(
        `http://localhost:8000/customer/hapus/${id}`
      );
      window.location.reload();
    } catch (err) {
      setErrorMessage(err.message);
    }
  }
  if (loading) {
    return <h1>Loading</h1>;
  } else {
    return (
      <div className="h-fit">
        <div className="w-full flex justify-start">
          <h1>Welcome to UC-Showcase</h1>
        </div>
        <h1 className="text-3xl">Lihat Pesanan untuk Pelanggan</h1>
        <h1>{errorMessage}</h1>
        <div className="w-full mt-8">
          <div className="flex justify-end gap-4">
            <Link
              to="/kendaraan"
              className={buttonVariants({ variant: 'default' })}
            >
              Lihat Kendaraan
            </Link>
            {kendaraanLength > 0 ? (
              <Dialog>
                <DialogTrigger>
                  <Button>Pesan Kendaraan untuk Pelanggan</Button>
                </DialogTrigger>
                <DialogContent className={'h-3/4 overflow-y-scroll'}>
                  <DialogHeader>
                    <DialogTitle>Tambahkan Informasi Pelanggan</DialogTitle>
                  </DialogHeader>
                  <TambahPesanan />
                </DialogContent>
              </Dialog>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="pt-8 w-4/5">
            {allCustomers.map((customer) => {
              return (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>
                      {customer.nama} - {customer.id_card}
                    </CardTitle>
                    <CardDescription>
                      {customer.alamat} - {customer.nomor_ponsel}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="w-full flex justify-around gap-4">
                    <Link
                      to={`/pesanan/${customer.id_card}`}
                      className={buttonVariants({ variant: 'default' })}
                    >
                      Lihat Pesanan
                    </Link>
                    <Dialog>
                      <DialogTrigger>
                        <Button>Edit Customer</Button>
                      </DialogTrigger>
                      <DialogContent className={'h-2/3 overflow-y-scroll'}>
                        <DialogHeader>
                          <DialogTitle>Ubah User</DialogTitle>
                        </DialogHeader>
                        <EditUser customer={customer} />
                      </DialogContent>
                    </Dialog>
                    <Button onClick={() => deleteUser(customer.id_card)}>
                      Delete Customer
                    </Button>
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const userSchema = z.object({
  nama: z.string().min(1),
  alamat: z.string().min(1),
  nomor_ponsel: z.string().min(1),
});

function EditUser(props) {
  console.log(props.customer.id_card);
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nama: props.customer.nama,
      alamat: props.customer.alamat,
      nomor_ponsel: props.customer.nomor_ponsel,
    },
  });

  async function onSubmit(values: z.input<typeof userSchema>) {
    const customer = {
      nama: values.nama,
      alamat: values.alamat,
      nomor_ponsel: values.nomor_ponsel,
      id_card: props.customer.id_card,
    };

    let updatedUser;

    try {
      updatedUser = await axios.put(
        `http://localhost:8000/customer/ubah/${props.customer.id_card}`,
        customer
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Kenny" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nomor_ponsel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Ponsel</FormLabel>
              <FormControl>
                <Input placeholder="08185027510" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alamat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input placeholder="Jalan Wornoreyo" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

function TambahPesanan() {
  const [allKendaraan, setAllKendaraan] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  useEffect(() => {
    getAllKendaraan();
  }, []);

  const form = useForm();

  async function getAllKendaraan() {
    try {
      const response = await axios.get('http://localhost:8000/kendaraan');
      setAllKendaraan(response.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function onSubmit(values) {
    try {
      const response = await axios.post(
        'http://localhost:8000/pesanan/tambah',
        values
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
      setErrorMessage(err.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="id_card"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Card</FormLabel>
              <FormControl>
                <Input placeholder="019201231213" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Kenny" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nomor_ponsel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Ponsel</FormLabel>
              <FormControl>
                <Input placeholder="08185027510" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alamat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input placeholder="Jalan Wornoreyo" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Separator />
        <h1 className="text-bold">Tentukan Jumlah Kendaraan</h1>
        {allKendaraan.map((kendaraan) => {
          return (
            <FormField
              control={form.control}
              name={`kendaraan_${kendaraan.id}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {kendaraan.tipe_kendaraan} - {kendaraan.manufaktur}{' '}
                    {kendaraan.model} {kendaraan.tahun}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          );
        })}
        <p>{errorMessage}</p>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default Pesanan;
