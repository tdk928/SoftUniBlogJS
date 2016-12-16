//Funksia za reshavane na test

function opcno(m,v) /* m-parvo cislo sled imeto na div za izpisvane; v-poslednite tri chisla */
{
  if (document.getElementById)
	 {obj=document.getElementById("example"+m+v)}
	
	else if (document.all)
	       {obj=document.all["example"+m+v]}
}

  function opc(m,v)
{
    opcno(m,v)
	if (obj)
	 {
	   if (obj.style.display=='none')
	      {obj.style.display=''}
		else 
		   {obj.style.display='none'}
	 }
}
  function opc1(m,M,b) /*glavna funkchia; m-parvo cislo sled imeto na div za izpisvane
                         M-broi otgovori; b-veren otgovor*/
{// mislq che vs sa si obqsnili horata :D ne to tva MvP .. qsno koe koe e vuprosa mi e kak sa vkarali otgvorite
    // s nqkav foreach v bazatadani spored men i tva proverqva
    // kak tiq bukvi i tiq cikli sa use6tat 4e na 5ta zada4a e 3ti otgovor primerno
    // ama to taka si e napisano v html-a be
    // tiq html-i ot kudeto si gi vzel sa ti doshli gotovi s dizain i otgovori i vsichko
    // napisali sa gi ru4no v tva opc/1/4/3/..?
    //emi da :D
    //togava zakvo sa mi cikli i raboti kak izob6to proverqva 4e potrebitelq e dal otgovor 2 pak to e 3

   var d=eval("document.Q1Form.Q"+m+"Choice"),/*promenliva za masto ot formata*/
       v=0;
   for(i=0;i<3;i++)
     {
       opcno(m,v)
       if (obj.style.display=='')
	      {obj.style.display='none'}
       v=i+1;
     }
   v=0
   for(i=0;i<M;i++)
     {
       if(d[i].checked==true)
          {v=i+1}
     }
   if(v==b)
     v=2
   else if(v>0) v=1
   opc(m,v);
}
        // End Funksia za reshavane na test -------

//Funkcia za izpisvaneto na kalendara

function buildCal(m, y, cM, cH, cDW, cD, brdr){
var mn=['&#1071;&#1085;&#1091;&#1072;&#1088;&#1080;','&#1060;&#1077;&#1074;&#1088;&#1091;&#1072;&#1088;&#1080;','&#1052;&#1072;&#1088;&#1090;','&#1040;&#1087;&#1088;&#1080;&#1083;','&#1052;&#1072;&#1081;','&#1070;&#1085;&#1080;','&#1070;&#1083;&#1080;','&#1040;&#1074;&#1075;&#1091;&#1089;&#1090;','&#1057;&#1077;&#1087;&#1090;&#1077;&#1084;&#1074;&#1088;&#1080;','&#1054;&#1082;&#1090;&#1086;&#1084;&#1074;&#1088;&#1080;','&#1053;&#1086;&#1077;&#1084;&#1074;&#1088;&#1080;','&#1044;&#1077;&#1082;&#1077;&#1084;&#1074;&#1088;&#1080;'];
var dim=[31,0,31,30,31,30,31,31,30,31,30,31];

var oD = new Date(y, m-1, 1); //DD replaced line to fix date bug when current day is 31st
oD.od=oD.getDay(); //chete tekustata data bes da a uvelichava s 1

var todaydate=new Date() //DD added
var scanfortoday=(y==todaydate.getFullYear() && m==todaydate.getMonth()+1)? todaydate.getDate() : 0 //DD added

dim[1]=(((oD.getFullYear()%100!=0)&&(oD.getFullYear()%4==0))||(oD.getFullYear()%400==0))?29:28;
var t='<div class="'+cM+'"><table class="'+cM+'" cols="7" cellpadding="0" border="'+brdr+'" cellspacing="0"><tr align="center">';
t+='<td colspan="7" align="center" class="'+cH+'">'+mn[m-1]+' - '+y+'</td></tr><tr align="center">';
for(s=0;s<7;s++)t+='<td class="'+cDW+'">'+"ПВСЧПСН".substr(s,1)+'</td>'; //S poredicata bukvi "npvscps" se opisvat parvite bukvi ot dnite na sedmicata 
t+='</tr><tr align="center">';
for(i=1;i<=42;i++){
var x=((i-oD.od>=0)&&(i-oD.od<dim[m-1]))? i-oD.od+1 : '&nbsp;';
if (x==scanfortoday) //DD added
x='<span id="today">'+x+'</span>' //DD added
t+='<td class="'+cD+'">'+x+'</td>';
if(((i)%7==0)&&(i<36))t+='</tr><tr align="center">';
}
return t+='</tr></table></div>';
}

