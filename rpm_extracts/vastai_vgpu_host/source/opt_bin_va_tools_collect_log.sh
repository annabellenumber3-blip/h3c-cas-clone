#!/bin/bash

############################### init params #########################

export LIBGUESTFS_BACKEND=direct

# 函数：显示使用方法
usage() {
    echo "使用方法: $0 -i <ID|ID范围> -n <虚拟机名称> -s <源文件路径>"
    echo "或 -a 收集所有vm的log文件"
    echo "选项 -o 指定输出文件压缩包路径"
    echo "如果 -i ，-s ，-a 和 -n 都没有指定，则默认不从guest获取log文件"
    echo "选项 -m 或 -mm 用于指定是否获取guest memory dump文件"
    echo "选项 -i 和 -n 是互斥的。"
    echo "选项 -s 用于指定虚拟机内部的源文件路径。"
    exit 1
}

# 检查参数数量
if [ "$#" -eq 0 ]; then
    HOST_ONLY=1
    echo "仅dump host log。"
else
    echo "dump host & guest log."
fi

# 初始化变量
MODE=""
VM_NAME=""
VM_ID_RANGE=""
SRC_PATH=""
MEMORY_DUMP=""
OUTPUT_PATH=""
QUME_LOG=""

# 解析命令行选项
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -i)
            IFS=',' read -ra INPUT <<< "$2"
            echo "Received input: ${INPUT[@]}"
            MODE="id"
            QUME_LOG="1"
            shift
            ;;
        -n)
            IFS=',' read -ra INPUT <<< "$2"
            echo "Received input: ${INPUT[@]}"
            MODE="name"
            QUME_LOG="1"
            shift
            ;;
        -a)
            MODE="all"
            QUME_LOG="1"
            ;;
        -s)
            SRC_PATH="$2"
            shift
            ;;
        -m)
            MEMORY_DUMP="1"
            ;;
        -mm)
            MINIMEMORY_DUMP="1"
            ;;
        -o)
            OUTPUT_PATH="$2"
            shift
            ;;
        *)
            usage
            ;;
    esac
    shift
done

# 检查源文件路径是否被设置
if [ -n "$MODE" ]; then
    if [ -z "$SRC_PATH" ]; then
        SRC_PATH="/ProgramData/vastai"
    fi
fi


###################################### host dump #############################################

# 获取内核版本
command=$(hostnamectl)

# 定义日志文件的位置
HWR_DIR=("/var/log")
HWR_LOG=("gpu_firmware_trace_*.log" "gpu_CSR_*.log")
LOG_DIR=("/var/log" "sf/log/today/")
KERN_LOGS=("kern.log*" "dmesg*" "messages*" "kernel.log")

# 定义输出文件的位置
OUTPUT_FILE="./vastai_logs.tar.gz"


# 检查是否有root权限
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

# 创建一个临时目录用于存放日志文件
TEMP_DIR=$(mktemp -d)
LOG_TEMP_DIR="${TEMP_DIR}/log"
HWR_TEMP_DIR="${TEMP_DIR}/hwr"
FWTRACE_TEMP_DIR="${TEMP_DIR}/fwtrace"

# 创建存放log信息的子目录
mkdir -p "${LOG_TEMP_DIR}"
mkdir -p "${HWR_TEMP_DIR}"
mkdir -p "${FWTRACE_TEMP_DIR}"

# 创建或清空文件
echo "System Information" > ${TEMP_DIR}/system_info.txt

echo "-----------------" >> ${TEMP_DIR}/system_info.txt

# 获取当前日期和时间
echo "Packaged Time:" >> ${TEMP_DIR}/system_info.txt
date "+%Y-%m-%d %H:%M:%S" >> ${TEMP_DIR}/system_info.txt

echo "-----------------" >> ${TEMP_DIR}/system_info.txt

# 获取系统版本
echo "System Version:" >> ${TEMP_DIR}/system_info.txt
cat /etc/os-release | grep PRETTY_NAME | cut -d'=' -f2 >> ${TEMP_DIR}/system_info.txt

echo "-----------------" >> ${TEMP_DIR}/system_info.txt

# 获取内核版本
echo "Kernel Version:" >> ${TEMP_DIR}/system_info.txt
uname -r >> ${TEMP_DIR}/system_info.txt

echo "-----------------" >> ${TEMP_DIR}/system_info.txt

count=$(grep -Eoc '(vmx|svm)' /proc/cpuinfo)
echo "grep -Eoc '(vmx|svm)' /proc/cpuinfo: $count" >> "${TEMP_DIR}/system_info.txt"

echo "-----------------" >> ${TEMP_DIR}/system_info.txt

# 获取CPU型号
echo "CPU Model:" >> ${TEMP_DIR}/system_info.txt
lscpu >> ${TEMP_DIR}/system_info.txt

echo "-----------------" >> ${TEMP_DIR}/system_info.txt

# 获取内存总大小
echo "Memory Total:" >> ${TEMP_DIR}/system_info.txt
free -h >> ${TEMP_DIR}/system_info.txt

echo "-----------------" >> ${TEMP_DIR}/system_info.txt

# ------NUMA节点信息----#

lspci | grep 1ec6 | while read -r device_info; do
  # 提取设备号
  device_id=$(echo "$device_info" | awk '{print $1}')

  # 将设备号转换为全局唯一标识符
  device_path=$(readlink -f /sys/bus/pci/devices/0000:${device_id})
  numa_node_path="${device_path}/numa_node"

  # 获取NUMA节点信息
  numa_node=$(cat $numa_node_path)

  # 将结果输出到指定文件
  echo "NUMA node for device ${device_id} is: ${numa_node}" >> "${TEMP_DIR}/system_info.txt"
done

echo "-----------------" >> ${TEMP_DIR}/system_info.txt

# ------lspci----#

echo "lspci:" >> ${TEMP_DIR}/system_info.txt
lspci -nn >> ${TEMP_DIR}/system_info.txt

# 检查并复制内核日志到临时目录的log子目录
for dir in "${LOG_DIR[@]}"; do
    for log in "${KERN_LOGS[@]}"; do
         find "${dir}" -name "${log}" -exec sh -c 'cp "$1" "$2" 2>/dev/null' sh {} "${LOG_TEMP_DIR}" \; >/dev/null 2>&1
    done
done

# 保存 dmesg 输出
$(dmesg > ${LOG_TEMP_DIR}/dmesg.txt)

for hwr_info in "${HWR_LOG[@]}"; do
    find "${HWR_DIR}" -name "${hwr_info}" -exec sh -c 'cp "$1" "$2"' sh {} "${HWR_TEMP_DIR}" \; >/dev/null 2>&1
done

# copy qemu log
if [ "$QUME_LOG" -eq 1 ]; then
    if [ ! -d "$LOG_TEMP_DIR/qemu" ]; then
        mkdir -p "$LOG_TEMP_DIR/qemu"
    fi
fi

# ------拷贝Valogger-----#
# 启动valogger程序
/opt/va/vaststream/vatools/valogger &

# 获取valogger的进程ID
VALOGGER_PID=$!
sleep 2

# 终止valogger进程
kill $VALOGGER_PID

cp -r /var/log/valog/fwlog ${LOG_TEMP_DIR}


# ------拷贝fwtrace-----#
# 遍历/sys/kernel/debug/va目录下所有以gpu开头的文件夹
for gpu_dir in /sys/kernel/debug/va/gpu*; do
  # 获取gpu编号
  gpu_num=$(basename "$gpu_dir" | sed 's/gpu//')
  
  # 源文件路径
  src_file="$gpu_dir/firmware_trace"
  
  # 目标文件路径
  dest_file="${FWTRACE_TEMP_DIR}/firmware_trace_${gpu_num}"
  
  # 拷贝文件并重命名
  if [ -f "$src_file" ]; then
    cp "$src_file" "$dest_file"
  else
    echo "File $src_file does not exist"
  fi
done

########################################## guest dump ############################################
# 定义复制文件的函数
copy_file_from_vm() {
    local vm_identifier=$1 # 可以是ID或名称
    local dest_path="${TEMP_DIR}/copy_out/$vm_identifier" # 在当前目录下为每个虚拟机创建独立目录
    mkdir -p "$dest_path" # 确保目录存在
    # 执行复制操作
    virt-copy-out -d "$vm_identifier" "$SRC_PATH" "$dest_path"
    if [ "$MEMORY_DUMP" = "1" ];then
        virt-copy-out -d "$vm_identifier" "/Windows/MEMORY.DMP" "$dest_path"
    fi
    if [ "$MINIMEMORY_DUMP" = "1" ];then
        virt-copy-out -d "$vm_identifier" "/Windows/Minidump" "$dest_path"
    fi
}
if [ -n "$MODE" ];then
    # 根据模式处理输入
    case $MODE in
    id)
        if command -v virt-copy-out virt-copy-out >/dev/null 2>&1 ; then
            for VM_ID_RANGE in "${INPUT[@]}"; do
                if [[ $VM_ID_RANGE == *-* ]]; then
                    # 解析ID范围
                    IFS='-' read -r ID_START ID_END <<< "$VM_ID_RANGE"
                    for (( ID=ID_START; ID<=ID_END; ID++ )); do
                        VM_NAME=$(virsh list --all | awk '{if ($1 == "'$ID'") print $2}')
                        if [ "$QUME_LOG" -eq 1 ]; then
                            cp -r /var/log/libvirt/qemu/${VM_NAME}.log "$LOG_TEMP_DIR/qemu"
                        fi                        
                        if [ -n "$VM_NAME" ]; then
                            copy_file_from_vm "$VM_NAME"
                            echo "$VM_NAME copy done."
                        else
                            echo "未找到ID为 $ID 的虚拟机。"
                        fi
                    done
                else
                    # 处理单个ID
                    VM_NAME=$(virsh list --all | awk '{if ($1 == "'$VM_ID_RANGE'") print $2}')

                    if [ "$QUME_LOG" -eq 1 ]; then
                        cp -r /var/log/libvirt/qemu/${VM_NAME}.log "$LOG_TEMP_DIR/qemu"
                    fi
                    if [ -n "$VM_NAME" ]; then
                        copy_file_from_vm "$VM_NAME"
                        echo "$VM_NAME copy done."
                    else
                        echo "未找到ID为 $VM_ID_RANGE 的虚拟机。"
                    fi
                fi
            done
        else
            echo "libguestfs not installed, unable to get guest logs"
        fi
        ;;
    name)
        if command -v virt-copy-out virt-copy-out >/dev/null 2>&1 ; then
            for VM_NAME in "${INPUT[@]}"; do
                if [ "$QUME_LOG" -eq 1 ]; then
                    cp -r /var/log/libvirt/qemu/${VM_NAME}.log "$LOG_TEMP_DIR/qemu"
                fi
                copy_file_from_vm "$VM_NAME"
                echo "$VM_NAME copy done."
            done
        else
            echo "libguestfs not installed, unable to get guest logs"
        fi
        ;;
    all)
        # 遍历所有虚拟机
        if [ "$QUME_LOG" -eq 1 ]; then
            cp -r /var/log/libvirt/qemu/* "$LOG_TEMP_DIR/qemu"
        fi
        if command -v virt-copy-out virt-copy-out >/dev/null 2>&1 ; then
            virsh list --all | awk 'NR>2 {print $2}' | while read -r VM_NAME; do
                if [ -n "$VM_NAME" ]; then
                    copy_file_from_vm "$VM_NAME"
                    echo "$VM_NAME copy done."
                fi
            done
        else
            echo "libguestfs not installed, unable to get guest logs"
        fi
        ;;
    *)
        usage
        ;;
    esac
fi

########################################## pack log ############################################

# 打包日志文件和proc信息
tar -czf "${OUTPUT_FILE}" -C "${TEMP_DIR}" . 

if [ -n "$OUTPUT_PATH" ]; then
    mv "${OUTPUT_FILE}" "${OUTPUT_PATH}"
    echo "Kernel logs have been packed into ${OUTPUT_PATH}"
else
    echo "Kernel logs have been packed into ${OUTPUT_FILE}"
fi
# 清理临时目录
rm -rf "${TEMP_DIR}"

rm -rf /var/log/valog/fwlog
