import { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Kendaraan() {
  const [allKendaraan, setAllKendaraan] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAllKendaraan();
  }, []);

  async function getAllKendaraan() {
    try {
      const request = await axios.get("http://localhost:8000/kendaraan");
      setAllKendaraan(request.data.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }
  if (loading) {
    return <h1>Loading</h1>;
  } else {
    return (
      <div className="h-fit">
        <h1 className="text-3xl">List Kendaraan</h1>
        <div className="w-full">
          <div className="flex justify-end content-end">
            <Dialog>
              <DialogTrigger>
                <Button>Tambah Kendaraan</Button>
              </DialogTrigger>
              <DialogContent className={"h-3/4 overflow-y-scroll"}>
                <DialogHeader>
                  <DialogTitle>
                    Tambahkan Kendaraan yang Ingin Anda Jual
                  </DialogTitle>
                  <TambahKendaraan />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="pt-8 w-4/5">
            {allKendaraan.map((kendaraan) => {
              return (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>
                      {kendaraan.manufaktur} - {kendaraan.model}{" "}
                      {kendaraan.tahun}
                    </CardTitle>
                    <CardDescription>Rp{kendaraan.harga}</CardDescription>
                  </CardHeader>
                  <CardContent></CardContent>
                  <CardFooter>
                    <p>Card Footer</p>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const kendaraanSchema = z.object({
  model: z.string().min(2),
  tahun: z.coerce.number().min(1700),
  jumlah_penumpang: z.coerce.number().min(1),
  manufaktur: z.string().min(2),
  harga: z.coerce.number().min(10000000),
  tipe_kendaraan: z.string(),
  tipe_bahan_bakar: z.string().default(""),
  luas_bagasi: z.coerce.number().default(0),
  ukuran_bagasi: z.coerce.number().default(0),
  kapasitas_bensin: z.coerce.number().default(0),
  jumlah_roda_ban: z.coerce.number().default(0),
  luas_area_kargo: z.coerce.number().default(0),
});

interface Kendaraan {
  model: string;
  tahun: number;
  jumlah_penumpang: number;
  manufaktur: string;
  harga: number;
  tipe_kendaraan: string;
}

interface Mobil extends Kendaraan {
  tipe_bahan_bakar: string;
  luas_bagasi: number;
}

interface Motor extends Kendaraan {
  ukuran_bagasi: number;
  kapasitas_bensin: number;
}

interface Truck extends Kendaraan {
  jumlah_roda_ban: number;
  luas_area_kargo: number;
}

function TambahKendaraan() {
  const [tipeKendaraan, setTipeKendaraan] = useState("MOBIL");
  const form = useForm<z.infer<typeof kendaraanSchema>>({
    resolver: zodResolver(kendaraanSchema),
    defaultValues: {
      model: "",
      tahun: 0,
      jumlah_penumpang: 0,
      manufaktur: "",
      harga: 0,
      tipe_kendaraan: "",
      tipe_bahan_bakar: "",
      luas_bagasi: 0,
      ukuran_bagasi: 0,
      kapasitas_bensin: 0,
      jumlah_roda_ban: 0,
      luas_area_kargo: 0,
    },
  });
  async function postKendaraan(values: z.input<typeof kendaraanSchema>) {
    let kendaraan: Mobil | Motor | Truck;
    console.log(values);
    switch (tipeKendaraan) {
      case "MOBIL":
        kendaraan = {
          model: values.model,
          tahun: values.tahun,
          jumlah_penumpang: values.jumlah_penumpang,
          manufaktur: values.manufaktur,
          harga: values.harga,
          tipe_kendaraan: tipeKendaraan,
          tipe_bahan_bakar: values.tipe_bahan_bakar,
          luas_bagasi: values.luas_bagasi,
        };
        break;
      case "MOTOR":
        kendaraan = {
          model: values.model,
          tahun: values.tahun,
          jumlah_penumpang: values.jumlah_penumpang,
          manufaktur: values.manufaktur,
          harga: values.harga,
          tipe_kendaraan: tipeKendaraan,
          ukuran_bagasi: values.ukuran_bagasi,
          kapasitas_bensin: values.kapasitas_bensin,
        };
        break;
      case "TRUCK":
        kendaraan = {
          model: values.model,
          tahun: values.tahun,
          jumlah_penumpang: values.jumlah_penumpang,
          manufaktur: values.manufaktur,
          harga: values.harga,
          tipe_kendaraan: tipeKendaraan,
          jumlah_roda_ban: values.jumlah_roda_ban,
          luas_area_kargo: values.luas_area_kargo,
        };
        break;
    }

    console.log(kendaraan);
    try {
      const response = await axios.post(
        "http://localhost:8000/kendaraan/tambah",
        kendaraan,
      );

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(postKendaraan)} className="space-y-8">
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="SUV" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tahun"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun</FormLabel>
              <FormControl>
                <Input type="number" placeholder="2018" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jumlah_penumpang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Penumpang</FormLabel>
              <FormControl>
                <Input type="number" placeholder="4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manufaktur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufaktur</FormLabel>
              <FormControl>
                <Input placeholder="Toyota" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="harga"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100000000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipe_kendaraan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe Kendaraan</FormLabel>
              <Select
                onValueChange={(value) => {
                  setTipeKendaraan(value);
                  field.onChange(value);
                  form.reset();
                }}
                defaultValue="MOBIL"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Tipe Kendaraan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MOBIL">Mobil</SelectItem>
                  <SelectItem value="MOTOR">Motor</SelectItem>
                  <SelectItem value="TRUCK">Truck</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {
          {
            MOBIL: (
              <>
                <FormField
                  control={form.control}
                  name="tipe_bahan_bakar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Bahan Bakar</FormLabel>
                      <FormControl>
                        <Input placeholder="Solar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="luas_bagasi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luas Bagasi</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ),

            MOTOR: (
              <>
                <FormField
                  control={form.control}
                  name="ukuran_bagasi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ukuran Bagasi</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kapasitas_bensin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kapasitas Bensin</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ),

            TRUCK: (
              <>
                <FormField
                  control={form.control}
                  name="jumlah_roda_ban"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Roda Ban</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="luas_area_kargo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luas Area Kargo</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ),
          }[tipeKendaraan]
        }
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
export default Kendaraan;
